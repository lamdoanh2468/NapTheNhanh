# Backend thanh toán VNPay — Nạp Thẻ Ngay

Server Node/Express giữ `secureSecret`, tạo URL thanh toán VNPay và xác nhận giao dịch.
**secureSecret không bao giờ được đưa vào app mobile** (decompile APK là lộ → giả mạo giao dịch).

## 1. Cấu hình

```bash
cd server
npm install
cp .env.example .env   # (đã tạo sẵn)
```

Đăng ký merchant **sandbox** tại https://sandbox.vnpayment.vn/devreg/ để lấy `tmnCode` + `secsecret`,
rồi điền vào `server/.env`:

```
VNP_TMN_CODE=xxxxxxxx
VNP_SECURE_SECRET=xxxxxxxxxxxxxxxx
```

## 2. Chạy

```bash
npm run dev     # tự reload khi sửa code
# hoặc: npm start
```

Server chạy ở `http://localhost:3000`. App mobile tự tìm server qua LAN IP của máy dev
(xem `src/utils/config.js`) — không cần chỉnh gì nếu điện thoại và máy tính cùng Wi-Fi.

## 3. Luồng

| Bước | Endpoint | Vai trò |
|------|----------|---------|
| 1 | `POST /api/orders` | Tạo đơn PENDING, tính giá phía server, trả `payUrl` |
| 2 | `GET /api/vnpay/return` | Trình duyệt người dùng quay về → chuyển sâu về app |
| 3 | `GET /api/vnpay/ipn` | VNPay gọi server→server, **xác nhận tin cậy** → cấp mã |
| 4 | `GET /api/orders/:id` | App poll trạng thái |

## 4. Test ở local (không cần domain công khai)

VNPay sandbox **không gọi tới `localhost` được** → IPN không tới ở local.
Đã bật `DEV_CONFIRM_ON_RETURN=true` trong `.env`: mã được cấp ngay ở bước Return (chỉ để test).

Muốn test đúng cả IPN như production:
1. Chạy tunnel: `npx cloudflared tunnel --url http://localhost:3000` (hoặc ngrok).
2. Đặt `PUBLIC_BASE_URL=https://<tunnel>` trong `.env`, `DEV_CONFIRM_ON_RETURN=false`.
3. Khai báo IPN URL `https://<tunnel>/api/vnpay/ipn` trong cổng merchant VNPay.

## 5. Trước khi lên production

- [ ] Thay store trong bộ nhớ (`src/store.js`) bằng DB thật + transaction.
- [ ] `PUBLIC_BASE_URL` = domain HTTPS công khai; `DEV_CONFIRM_ON_RETURN=false`.
- [ ] `VNP_HOST=https://vnpayment.vn`, `VNP_TEST_MODE=false`, dùng credential production.
- [ ] Khai báo IPN URL trong cổng merchant VNPay.
- [ ] Thay `issueCodes()` giả lập bằng API nhà phát hành thẻ thật.
