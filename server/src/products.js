// Nguồn SỰ THẬT về giá sản phẩm vật lý (phụ kiện game & hàng công nghệ).
// Client gửi lên sku + số lượng; server tính lại toàn bộ để chặn giả mạo giá.
// Giữ đồng bộ với PRODUCTS trong src/data/catalog.js của app.
const PRODUCTS = [
  // Phụ kiện game
  { sku: "ACC-01", name: "USB 3.2 Kingston 128GB DataTraveler Exodia DTX", price: 310000 },
  { sku: "ACC-02", name: "USB 3.2 Kingston 64GB DataTraveler Exodia DTX", price: 159000 },
  { sku: "ACC-03", name: "USB 3.2 Kingston 32GB DataTraveler Exodia DTX", price: 89000 },
  { sku: "ACC-04", name: "Webcam Modern Microsoft (Đen)", price: 2450000 },
  { sku: "ACC-05", name: "Webcam Dahua HTI-UC325", price: 649000 },
  { sku: "ACC-06", name: "Webcam Dahua DH-UZ3", price: 990000 },
  { sku: "ACC-07", name: "Webcam Dahua HTI-UC320", price: 475000 },
  { sku: "ACC-08", name: "Webcam Newmen CM303", price: 599000 },
  { sku: "ACC-09", name: "Webcam Rapoo C270L", price: 709000 },
  { sku: "ACC-10", name: "Webcam Hikvision DS-UL8", price: 5660000 },
  { sku: "ACC-11", name: "Webcam Hikvision DS-UL4", price: 4400000 },
  { sku: "ACC-12", name: "Webcam Hikvision DS-UL2", price: 3760000 },
  { sku: "ACC-13", name: "Webcam Hikvision DS-U18", price: 4890000 },
  { sku: "ACC-14", name: "Webcam Hikvision DS-U12", price: 1620000 },
  { sku: "ACC-15", name: "Webcam Hikvision DS-U02", price: 599000 },
  { sku: "ACC-16", name: "Webcam Hikvision DS-U525", price: 1650000 },
  { sku: "ACC-17", name: "Webcam Hikvision DS-U320", price: 980000 },
  { sku: "ACC-18", name: "USB 3.1 Sandisk Ultra Luxe 256GB SDCZ74", price: 929000 },
  { sku: "ACC-19", name: "USB SanDisk Cruzer 64GB CZ33 Cruzer Fit", price: 213000 },
  { sku: "ACC-20", name: "Quạt Mini Kiêm Sạc Dự Phòng IDMIX TEDDY BEAR 2000mAh", price: 480000 },
  { sku: "ACC-21", name: "Webcam ROG EYE S", price: 2390000 },
  { sku: "ACC-22", name: "Webcam ASUS C3", price: 1263000 },
  { sku: "ACC-23", name: "Webcam PK-925H A4tech (Đen bạc)", price: 795000 },
  { sku: "ACC-24", name: "USB 3.1 TypeC Sandisk Ultra Dual Drive 128GB", price: 500000 },
  // Hàng công nghệ
  { sku: "TECH-01", name: "Laptop Asus X515EA-EJ1046W (i5-1135G7) (Bạc)", price: 17690000 },
  { sku: "TECH-02", name: "Ghế gaming E-dra Nappa EGC2022 Lux (Trắng)", price: 7990000 },
  { sku: "TECH-03", name: "Ghế gaming E-dra Nappa EGC2022 Lux (Xanh)", price: 7990000 },
  { sku: "TECH-04", name: "Ghế gaming E-dra Nappa EGC2022 Lux (Đen)", price: 7990000 },
  { sku: "TECH-05", name: "Ghế gaming E-dra Apollo EGC227 Plus (Trắng)", price: 2090000 },
  { sku: "TECH-06", name: "Ghế gaming E-dra Apollo EGC227 Plus (Đỏ)", price: 2090000 },
  { sku: "TECH-07", name: "Ghế gaming E-dra Apollo EGC227 Plus (Đen)", price: 2090000 },
  { sku: "TECH-08", name: "Ghế gaming E-dra Apollo EGC227 (Trắng)", price: 1990000 },
  { sku: "TECH-09", name: "Ghế gaming E-dra Apollo EGC227 (Đỏ)", price: 1990000 },
  { sku: "TECH-10", name: "Laptop HP Pavilion X360 14-dy0076TU (i5-1135G7) (Vàng)", price: 20990000 },
  { sku: "TECH-11", name: "Laptop HP VICTUS 16-e0170AX (Ryzen 7 5800H) (Đen)", price: 28890000 },
  { sku: "TECH-12", name: "Laptop HP VICTUS 16-d0204TX (i5-11400H) (Đen)", price: 27590000 },
  { sku: "TECH-13", name: "Laptop Asus A515EA-BQ1530W (i3-1115G4) (Bạc)", price: 15990000 },
  { sku: "TECH-14", name: "VGA Gigabyte Radeon RX 6700 XT EAGLE OC 12G", price: 25590000 },
  { sku: "TECH-15", name: "Mainboard Gigabyte Z690 AERO D", price: 12300000 },
  { sku: "TECH-16", name: "Mainboard Gigabyte Z690 AORUS PRO DDR4", price: 8700000 },
  { sku: "TECH-17", name: "Mainboard Gigabyte Z690 AERO G", price: 8650000 },
  { sku: "TECH-18", name: "Mainboard Gigabyte Z690 AORUS ELITE AX", price: 8200000 },
  { sku: "TECH-19", name: "Mainboard Gigabyte Z690 AORUS ELITE", price: 7650000 },
  { sku: "TECH-20", name: "Mainboard Gigabyte B560M DS3H V2", price: 2690000 },
  { sku: "TECH-21", name: "Laptop Gigabyte G5 KC-5S11130SB (i5-10500H) (Đen)", price: 27990000 },
  { sku: "TECH-22", name: "Điện thoại Samsung Galaxy A32 (6GB/128GB/90Hz) (Xanh)", price: 6360000 },
  { sku: "TECH-23", name: 'Màn hình LCD HP 23.8" E24mv G4 (1920x1080, IPS)', price: 7900000 },
  { sku: "TECH-24", name: "Ổ cứng SSD Samsung 2TB SATA III 870 QVO", price: 6200000 },
  // Hoa tươi
  { sku: "FLW-01", name: "Bó hồng đỏ 20 bông", price: 650000 },
  { sku: "FLW-02", name: "Giỏ hoa tulip pastel", price: 890000 },
  { sku: "FLW-03", name: "Hộp hoa baby trắng", price: 450000 },
];

const BY_SKU = new Map(PRODUCTS.map((p) => [p.sku, p]));

export const MAX_ITEM_QTY = 20; // trần số lượng mỗi dòng, chống đơn ảo giá trị lớn.
export const FREE_SHIP_THRESHOLD = 500000; // miễn phí ship từ mức này.
export const SHIPPING_FEE = 30000;

// Tính giá đơn hàng vật lý từ danh sách { sku, qty }. Trả về null nếu bất kỳ dòng nào
// không hợp lệ (sku lạ, số lượng sai) — chặn client tự bịa giá/sku.
export function quoteProduct(items) {
  if (!Array.isArray(items) || items.length === 0) return null;

  const lines = [];
  let subtotal = 0;
  for (const it of items) {
    const p = BY_SKU.get(it?.sku);
    if (!p) return null;
    const qty = it?.qty;
    if (!Number.isInteger(qty) || qty < 1 || qty > MAX_ITEM_QTY) return null;
    const lineTotal = p.price * qty;
    subtotal += lineTotal;
    lines.push({ sku: p.sku, name: p.name, price: p.price, qty, lineTotal });
  }

  const shippingFee = subtotal >= FREE_SHIP_THRESHOLD ? 0 : SHIPPING_FEE;
  return { lines, subtotal, discount: 0, shippingFee, total: subtotal + shippingFee };
}
