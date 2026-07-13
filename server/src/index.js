import express from "express";
import cors from "cors";
import {
  ProductCode,
  VnpLocale,
  dateFormat,
  IpnSuccess,
  IpnFailChecksum,
  IpnOrderNotFound,
  IpnInvalidAmount,
  InpOrderAlreadyConfirmed,
  IpnUnknownError,
} from "vnpay";

import { config, assertConfig } from "./config.js";
import { vnpay } from "./vnpay.js";
import { quotePrice } from "./catalog.js";
import { quoteProduct } from "./products.js";
import {
  newOrderId,
  createOrder,
  getOrder,
  markPaid,
  markFailed,
} from "./store.js";

const app = express();
app.use(cors());
app.use(express.json());
// VNPay redirect Return URL kèm query — không cần body parser cho GET.

/* Lấy IP client ở dạng chuỗi cho vnp_IpAddr. */
function clientIp(req) {
  const xff = (req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  const ip = xff || req.socket?.remoteAddress || "127.0.0.1";
  return ip.replace(/^::ffff:/, "").replace("::1", "127.0.0.1");
}

/* Base URL công khai để dựng Return URL. Dev: suy ra từ request (LAN IP). */
function publicBase(req) {
  return config.publicBaseUrl || `${req.protocol}://${req.get("host")}`;
}

/* Chỉ chấp nhận deep link về app (chống open-redirect). Không hợp lệ → dùng mặc định. */
function safeAppReturn(url) {
  if (typeof url === "string" && /^(napthengay:\/\/|exp(\+napthengay)?:\/\/)/.test(url)) {
    return url;
  }
  return config.appReturnUrl;
}

/* Escape để nhúng an toàn vào thuộc tính HTML (href). */
function htmlAttr(s) {
  return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

app.get("/", (_req, res) => res.json({ ok: true, service: "napthengay-vnpay" }));

/* ============================================================
 * 1) TẠO ĐƠN + TẠO URL THANH TOÁN
 *    App gọi endpoint này, nhận payUrl rồi mở bằng trình duyệt.
 * ============================================================ */
app.post("/api/orders", (req, res) => {
  const {
    kind, userId, cardTypeId, denom, qty, items, shipping,
    email, paymentId, returnUrl,
  } = req.body || {};

  if (!config.vnp.tmnCode || !config.vnp.secureSecret) {
    return res
      .status(503)
      .json({ error: "Server chưa cấu hình VNPay (thiếu tmnCode/secret)." });
  }

  // Dựng dữ liệu đơn theo loại: "product" (hàng vật lý) hay "card" (thẻ game — mặc định).
  let orderData;
  let total;
  if (kind === "product") {
    const quote = quoteProduct(items);
    if (!quote) {
      return res.status(400).json({ error: "Thông tin đơn hàng không hợp lệ." });
    }
    // Đơn vật lý cần địa chỉ giao hàng.
    const s = shipping || {};
    if (!s.name || !s.phone || !s.address) {
      return res.status(400).json({ error: "Thiếu thông tin giao hàng (tên, SĐT, địa chỉ)." });
    }
    total = quote.total;
    orderData = {
      kind: "product",
      items: quote.lines,
      shipping: { name: s.name, phone: s.phone, address: s.address },
      subtotal: quote.subtotal,
      discount: quote.discount,
      shippingFee: quote.shippingFee,
      total: quote.total,
    };
  } else {
    const quote = quotePrice({ cardTypeId, denom, qty });
    if (!quote) {
      return res.status(400).json({ error: "Thông tin đơn hàng không hợp lệ." });
    }
    total = quote.total;
    orderData = {
      kind: "card",
      cardTypeId,
      cardName: quote.card.name,
      denom,
      qty,
      subtotal: quote.subtotal,
      discount: quote.discount,
      total: quote.total,
    };
  }

  const orderId = newOrderId();
  createOrder({
    id: orderId,
    userId: userId || null,
    email: email || null,
    paymentId: paymentId || null,
    returnUrl: safeAppReturn(returnUrl),
    ...orderData,
  });

  const now = new Date();
  const expire = new Date(now.getTime() + 15 * 60 * 1000); // hết hạn sau 15 phút

  const payUrl = vnpay.buildPaymentUrl({
    vnp_Amount: total, // TIỀN VND THẬT — thư viện tự nhân 100.
    vnp_IpAddr: clientIp(req),
    vnp_TxnRef: orderId, // mã đối soát, phải là duy nhất.
    vnp_OrderInfo: `Thanh toan don hang ${orderId}`,
    vnp_OrderType: ProductCode.Other,
    vnp_ReturnUrl: `${publicBase(req)}/api/vnpay/return`,
    vnp_Locale: VnpLocale.VN,
    vnp_CreateDate: dateFormat(now),
    vnp_ExpireDate: dateFormat(expire),
  });

  res.json({ orderId, payUrl, total });
});

/* ============================================================
 * 2) RETURN URL — nơi TRÌNH DUYỆT người dùng quay về sau khi trả tiền.
 *    CHỈ để hiển thị + đưa người dùng về app. KHÔNG tin tưởng tuyệt đối
 *    (người dùng có thể tự gọi lại URL này) — nguồn tin cậy là IPN.
 * ============================================================ */
app.get("/api/vnpay/return", (req, res) => {
  let ok = false;
  let orderId = req.query.vnp_TxnRef || "";
  try {
    const verify = vnpay.verifyReturnUrl(req.query);
    ok = verify.isVerified && verify.isSuccess;

    // DEV ONLY: cấp mã ngay tại đây để test local không cần IPN/tunnel.
    if (ok && config.devConfirmOnReturn) {
      const order = getOrder(orderId);
      if (order && Number(verify.vnp_Amount) === Number(order.total)) {
        markPaid(order);
      }
    }
  } catch (e) {
    ok = false;
  }

  // Trang trung gian tự chuyển về app qua deep link.
  // Ưu tiên returnUrl app đã gửi khi tạo đơn (đúng cho Expo Go lẫn bản build), fallback mặc định.
  const status = ok ? "success" : "failed";
  const order = getOrder(orderId);
  const base = safeAppReturn(order?.returnUrl);
  const sep = base.includes("?") ? "&" : "?";
  const deepLink = `${base}${sep}orderId=${encodeURIComponent(orderId)}&status=${status}`;
  res
    .status(200)
    .type("html")
    .send(`<!doctype html><html lang="vi"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Kết quả thanh toán</title>
<style>body{font-family:system-ui,Segoe UI,Roboto,sans-serif;text-align:center;padding:40px 20px;color:#111}
.ok{color:#059669}.err{color:#e63946}a.btn{display:inline-block;margin-top:20px;padding:12px 20px;background:#e63946;color:#fff;border-radius:10px;text-decoration:none;font-weight:700}</style>
</head><body>
<h2 class="${ok ? "ok" : "err"}">${ok ? "Thanh toán thành công" : "Thanh toán không thành công"}</h2>
<p>Đang quay lại ứng dụng…</p>
<a class="btn" href="${htmlAttr(deepLink)}">Mở app Nạp Thẻ Ngay</a>
<script>setTimeout(function(){location.href=${JSON.stringify(deepLink)}},600);</script>
</body></html>`);
});

/* ============================================================
 * 3) IPN — VNPay gọi SERVER-TO-SERVER. ĐÂY mới là nguồn xác nhận tin cậy.
 *    Phải trả đúng { RspCode, Message } theo chuẩn VNPay.
 *    Lưu ý: URL IPN được khai báo trong cổng merchant VNPay, không gửi kèm request.
 *    Ở production, PUBLIC_BASE_URL phải là domain HTTPS công khai để VNPay gọi tới.
 * ============================================================ */
app.get("/api/vnpay/ipn", (req, res) => {
  try {
    const verify = vnpay.verifyIpnCall(req.query);
    if (!verify.isVerified) return res.json(IpnFailChecksum);

    const order = getOrder(req.query.vnp_TxnRef);
    if (!order) return res.json(IpnOrderNotFound);

    // verify.vnp_Amount đã được thư viện chia 100 → là VND thật.
    if (Number(verify.vnp_Amount) !== Number(order.total)) {
      return res.json(IpnInvalidAmount);
    }

    if (order.status === "PAID" || order.status === "DELIVERED") {
      return res.json(InpOrderAlreadyConfirmed);
    }

    if (verify.isSuccess) {
      markPaid(order); // cấp mã
    } else {
      markFailed(order);
    }
    // Đã ghi nhận kết quả → báo VNPay thành công để ngừng retry.
    return res.json(IpnSuccess);
  } catch (e) {
    return res.json(IpnUnknownError);
  }
});

/* ============================================================
 * 4) POLL TRẠNG THÁI — app hỏi lại sau khi đóng trình duyệt.
 * ============================================================ */
app.get("/api/orders/:id", (req, res) => {
  const order = getOrder(req.params.id);
  if (!order) return res.status(404).json({ error: "Không tìm thấy đơn." });
  res.json({
    id: order.id,
    kind: order.kind || "card",
    status: order.status,
    total: order.total,
    subtotal: order.subtotal,
    discount: order.discount,
    shippingFee: order.shippingFee,
    // Đơn thẻ
    cardName: order.cardName,
    denom: order.denom,
    qty: order.qty,
    // Đơn hàng vật lý
    items: order.items,
    shipping: order.shipping,
    email: order.email,
    paymentId: order.paymentId,
    codes: order.status === "DELIVERED" ? order.codes : [],
    createdAt: order.createdAt,
  });
});

assertConfig();
app.listen(config.port, () => {
  console.log(`[VNPay server] đang chạy tại http://localhost:${config.port}`);
  console.log(`  testMode=${config.vnp.testMode}  devConfirmOnReturn=${config.devConfirmOnReturn}`);
});
