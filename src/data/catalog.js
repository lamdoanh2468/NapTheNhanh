// Dữ liệu danh mục — khi có backend, thay bằng GET /api/catalog
import { Gamepad2, Headphones, Cpu, Flower2 } from "lucide-react-native";
import bankIcon from "../imgs/bank_icon.png";
import vcoinCard from "../imgs/V_COIN_01.png";
import garenaCard from "../imgs/GARENA_01.png";
import zingCard from "../imgs/ZING_01.png";
import appotaCard from "../imgs/APPOTA_CARD_01.png";
import oncashCard from "../imgs/ONCASH_01.png";
import bitCard from "../imgs/BIT_01.png";

export const COMPANY = {
  name: "CÔNG TY CỔ PHẦN FUNTEK VIỆT NAM",
  license:
    "Giấy chứng nhận đăng ký kinh doanh số: 0109054589 do Sở Kế hoạch Đầu tư Thành phố Hà Nội cấp ngày 06/01/2020",
  address:
    "Số 31 phố Chùa Láng, Phường Láng Thượng, Quận Đống Đa, Thành phố Hà Nội, Việt Nam",
  hotlines: ["0776 395 737", "034 510 2760"],
  email: "hotro@napthengay.vn",
};

export const CATEGORIES = [
  { id: "game", slug: "nap-game", label: "Nạp game", icon: Gamepad2 },
  {
    id: "accessory",
    slug: "phu-kien-game",
    label: "Phụ kiện game",
    icon: Headphones,
  },
  { id: "tech", slug: "hang-cong-nghe", label: "Hàng công nghệ", icon: Cpu },
  { id: "flower", slug: "hoa-tuoi", label: "Hoa tươi", icon: Flower2 },
];

export const CARD_TYPES = [
  { id: "v-coin", name: "V-Coin", color: "#e63946", discount: 0.03, icon: vcoinCard },
  { id: "garena", name: "Garena", color: "#f77f00", discount: 0.02, icon: garenaCard },
  { id: "zing", name: "Zing", color: "#1d4ed8", discount: 0.025, icon: zingCard },
  { id: "appota", name: "Appota", color: "#0891b2", discount: 0.04, icon: appotaCard },
  { id: "oncash", name: "On Cash", color: "#059669", discount: 0.05, icon: oncashCard },
  { id: "bit", name: "Bit", color: "#db2777", discount: 0.02, icon: bitCard },
];

export const DENOMINATIONS = [
  10000, 20000, 50000, 100000, 200000, 500000, 1000000,
];

// Một cổng duy nhất: VNPay. Bên trong trang VNPay người dùng vẫn chọn được
// QR ngân hàng, ví MoMo/ZaloPay, thẻ ATM nội địa hoặc thẻ quốc tế.
export const PAYMENTS = [
  {
    id: "vnpay",
    name: "Cổng VNPay",
    note: "QR ngân hàng, ví điện tử, thẻ ATM/quốc tế",
    icon: bankIcon,
  },
];

// Sản phẩm vật lý — dữ liệu lấy từ shop napthengay.vn (phụ kiện game & hàng công nghệ).
// `kind` quyết định ảnh minh hoạ SVG hiển thị (xem ProductThumb). `sku` là mã server
// dùng để tính lại giá — GIÁ Ở SERVER MỚI LÀ NGUỒN SỰ THẬT (server/src/products.js).
export const PRODUCTS = {
  accessory: [
    { sku: "ACC-01", kind: "usb", name: "USB 3.2 Kingston 128GB DataTraveler Exodia DTX", price: 310000 },
    { sku: "ACC-02", kind: "usb", name: "USB 3.2 Kingston 64GB DataTraveler Exodia DTX", price: 159000 },
    { sku: "ACC-03", kind: "usb", name: "USB 3.2 Kingston 32GB DataTraveler Exodia DTX", price: 89000 },
    { sku: "ACC-04", kind: "webcam", name: "Webcam Modern Microsoft (Đen)", price: 2450000 },
    { sku: "ACC-05", kind: "webcam", name: "Webcam Dahua HTI-UC325", price: 649000 },
    { sku: "ACC-06", kind: "webcam", name: "Webcam Dahua DH-UZ3", price: 990000 },
    { sku: "ACC-07", kind: "webcam", name: "Webcam Dahua HTI-UC320", price: 475000 },
    { sku: "ACC-08", kind: "webcam", name: "Webcam Newmen CM303", price: 599000 },
    { sku: "ACC-09", kind: "webcam", name: "Webcam Rapoo C270L", price: 709000 },
    { sku: "ACC-10", kind: "webcam", name: "Webcam Hikvision DS-UL8", price: 5660000 },
    { sku: "ACC-11", kind: "webcam", name: "Webcam Hikvision DS-UL4", price: 4400000 },
    { sku: "ACC-12", kind: "webcam", name: "Webcam Hikvision DS-UL2", price: 3760000 },
    { sku: "ACC-13", kind: "webcam", name: "Webcam Hikvision DS-U18", price: 4890000 },
    { sku: "ACC-14", kind: "webcam", name: "Webcam Hikvision DS-U12", price: 1620000 },
    { sku: "ACC-15", kind: "webcam", name: "Webcam Hikvision DS-U02", price: 599000 },
    { sku: "ACC-16", kind: "webcam", name: "Webcam Hikvision DS-U525", price: 1650000 },
    { sku: "ACC-17", kind: "webcam", name: "Webcam Hikvision DS-U320", price: 980000 },
    { sku: "ACC-18", kind: "usb", name: "USB 3.1 Sandisk Ultra Luxe 256GB SDCZ74", price: 929000 },
    { sku: "ACC-19", kind: "usb", name: "USB SanDisk Cruzer 64GB CZ33 Cruzer Fit", price: 213000 },
    { sku: "ACC-20", kind: "powerbank", name: "Quạt Mini Kiêm Sạc Dự Phòng IDMIX TEDDY BEAR 2000mAh", price: 480000 },
    { sku: "ACC-21", kind: "webcam", name: "Webcam ROG EYE S", price: 2390000 },
    { sku: "ACC-22", kind: "webcam", name: "Webcam ASUS C3", price: 1263000 },
    { sku: "ACC-23", kind: "webcam", name: "Webcam PK-925H A4tech (Đen bạc)", price: 795000 },
    { sku: "ACC-24", kind: "usb", name: "USB 3.1 TypeC Sandisk Ultra Dual Drive 128GB", price: 500000 },
  ],
  tech: [
    { sku: "TECH-01", kind: "laptop", name: "Laptop Asus X515EA-EJ1046W (i5-1135G7) (Bạc)", price: 17690000 },
    { sku: "TECH-02", kind: "chair", name: "Ghế gaming E-dra Nappa EGC2022 Lux (Trắng)", price: 7990000 },
    { sku: "TECH-03", kind: "chair", name: "Ghế gaming E-dra Nappa EGC2022 Lux (Xanh)", price: 7990000 },
    { sku: "TECH-04", kind: "chair", name: "Ghế gaming E-dra Nappa EGC2022 Lux (Đen)", price: 7990000 },
    { sku: "TECH-05", kind: "chair", name: "Ghế gaming E-dra Apollo EGC227 Plus (Trắng)", price: 2090000 },
    { sku: "TECH-06", kind: "chair", name: "Ghế gaming E-dra Apollo EGC227 Plus (Đỏ)", price: 2090000 },
    { sku: "TECH-07", kind: "chair", name: "Ghế gaming E-dra Apollo EGC227 Plus (Đen)", price: 2090000 },
    { sku: "TECH-08", kind: "chair", name: "Ghế gaming E-dra Apollo EGC227 (Trắng)", price: 1990000 },
    { sku: "TECH-09", kind: "chair", name: "Ghế gaming E-dra Apollo EGC227 (Đỏ)", price: 1990000 },
    { sku: "TECH-10", kind: "laptop", name: "Laptop HP Pavilion X360 14-dy0076TU (i5-1135G7) (Vàng)", price: 20990000 },
    { sku: "TECH-11", kind: "laptop", name: "Laptop HP VICTUS 16-e0170AX (Ryzen 7 5800H) (Đen)", price: 28890000 },
    { sku: "TECH-12", kind: "laptop", name: "Laptop HP VICTUS 16-d0204TX (i5-11400H) (Đen)", price: 27590000 },
    { sku: "TECH-13", kind: "laptop", name: "Laptop Asus A515EA-BQ1530W (i3-1115G4) (Bạc)", price: 15990000 },
    { sku: "TECH-14", kind: "vga", name: "VGA Gigabyte Radeon RX 6700 XT EAGLE OC 12G", price: 25590000 },
    { sku: "TECH-15", kind: "mainboard", name: "Mainboard Gigabyte Z690 AERO D", price: 12300000 },
    { sku: "TECH-16", kind: "mainboard", name: "Mainboard Gigabyte Z690 AORUS PRO DDR4", price: 8700000 },
    { sku: "TECH-17", kind: "mainboard", name: "Mainboard Gigabyte Z690 AERO G", price: 8650000 },
    { sku: "TECH-18", kind: "mainboard", name: "Mainboard Gigabyte Z690 AORUS ELITE AX", price: 8200000 },
    { sku: "TECH-19", kind: "mainboard", name: "Mainboard Gigabyte Z690 AORUS ELITE", price: 7650000 },
    { sku: "TECH-20", kind: "mainboard", name: "Mainboard Gigabyte B560M DS3H V2", price: 2690000 },
    { sku: "TECH-21", kind: "laptop", name: "Laptop Gigabyte G5 KC-5S11130SB (i5-10500H) (Đen)", price: 27990000 },
    { sku: "TECH-22", kind: "phone", name: "Điện thoại Samsung Galaxy A32 (6GB/128GB/90Hz) (Xanh)", price: 6360000 },
    { sku: "TECH-23", kind: "monitor", name: 'Màn hình LCD HP 23.8" E24mv G4 (1920x1080, IPS)', price: 7900000 },
    { sku: "TECH-24", kind: "ssd", name: "Ổ cứng SSD Samsung 2TB SATA III 870 QVO", price: 6200000 },
  ],
  flower: [
    { sku: "FLW-01", kind: "flower", name: "Bó hồng đỏ 20 bông", price: 650000 },
    { sku: "FLW-02", kind: "flower", name: "Giỏ hoa tulip pastel", price: 890000 },
    { sku: "FLW-03", kind: "flower", name: "Hộp hoa baby trắng", price: 450000 },
  ],
};

// Phí vận chuyển sản phẩm vật lý (khớp Chính sách vận chuyển): miễn phí từ 500.000đ,
// dưới mức đó phụ thu 30.000đ. Server tính lại — đây chỉ để hiển thị trước.
export const FREE_SHIP_THRESHOLD = 500000;
export const SHIPPING_FEE = 30000;

export const NEWS = [
  {
    slug: "uu-dai-on-cash-thang-7",
    tag: "Khuyến mãi",
    date: "10/07/2026",
    title: "Ưu đãi 5% cho thẻ On Cash trong tháng 7",
    excerpt:
      "Áp dụng cho mọi mệnh giá, cộng dồn với chiết khấu thành viên. Chương trình kéo dài đến hết 31/07.",
  },
  {
    slug: "huong-dan-nhan-giftcode-momo",
    tag: "Hướng dẫn",
    date: "05/07/2026",
    title: "Hướng dẫn nhận giftcode khi nạp qua MoMo",
    excerpt:
      "Ba bước để nhận giftcode tự động gửi về email ngay sau khi giao dịch được xác nhận.",
  },
  {
    slug: "bo-sung-menh-gia-garena",
    tag: "Sản phẩm",
    date: "01/07/2026",
    title: "Bổ sung mệnh giá 1.000.000đ cho thẻ Garena",
    excerpt:
      "Mệnh giá mới dành cho người chơi nạp số lượng lớn, giảm số lần thao tác thanh toán.",
  },
];

export const FAQS = [
  {
    q: "Bao lâu tôi nhận được mã thẻ?",
    a: "Mã thẻ được gửi về email ngay sau khi cổng thanh toán xác nhận giao dịch thành công, thường trong vòng 30 giây. Bạn cũng có thể xem lại mã trong mục Lịch sử giao dịch.",
  },
  {
    q: "Tôi không nhận được email chứa mã thẻ?",
    a: "Kiểm tra thư mục Spam hoặc Quảng cáo trước. Nếu vẫn không thấy, đăng nhập và mở Lịch sử giao dịch — mã luôn được lưu tại đó. Cần hỗ trợ thêm, gọi hotline 0776 395 737.",
  },
  {
    q: "Mã thẻ đã mua có đổi trả được không?",
    a: "Mã thẻ đã hiển thị hoặc đã sử dụng không thể hoàn tiền. Trường hợp mã lỗi do hệ thống, chúng tôi cấp lại mã mới hoặc hoàn tiền theo Chính sách đổi trả.",
  },
  {
    q: "Có giới hạn số lượng thẻ mỗi giao dịch không?",
    a: "Mỗi giao dịch mua tối đa 20 thẻ cùng mệnh giá. Cần số lượng lớn hơn, liên hệ hotline để được báo giá chiết khấu sỉ.",
  },
  {
    q: "Website hỗ trợ những hình thức thanh toán nào?",
    a: "Ví MoMo, ZaloPay và chuyển khoản ngân hàng. MoMo và ZaloPay xác nhận tức thì; chuyển khoản mất 1–5 phút.",
  },
];

// Hướng dẫn mua thẻ — mỗi loại thẻ một trang
export const GUIDES = CARD_TYPES.reduce((acc, c) => {
  acc[c.id] = {
    title: `Hướng dẫn mua thẻ ${c.name}`,
    intro: `Các bước mua và sử dụng mã thẻ ${c.name} trên Nạp Thẻ Ngay. Toàn bộ quy trình mất chưa tới 1 phút.`,
    steps: [
      {
        title: "Chọn loại thẻ và mệnh giá",
        body: `Tại trang chủ, chọn ${c.name} trong danh sách nhà phát hành, sau đó chọn mệnh giá bạn cần. Chiết khấu ${(c.discount * 100).toFixed(1)}% được trừ tự động vào tổng tiền.`,
      },
      {
        title: "Nhập số lượng và email nhận mã",
        body: "Mỗi giao dịch mua tối đa 20 thẻ. Nhập email chính xác — đây là nơi mã thẻ được gửi tới.",
      },
      {
        title: "Chọn hình thức thanh toán",
        body: "Chọn Ví MoMo, ZaloPay hoặc chuyển khoản ngân hàng, rồi bấm Thanh toán để chuyển sang cổng thanh toán.",
      },
      {
        title: "Nhận mã thẻ",
        body: `Sau khi thanh toán thành công, mã thẻ ${c.name} được gửi về email và lưu trong mục Lịch sử giao dịch của tài khoản.`,
      },
      {
        title: "Sử dụng mã thẻ",
        body: `Đăng nhập trang nạp của ${c.name}, chọn nạp bằng thẻ, nhập mã và số seri vừa nhận để cộng tiền vào tài khoản game.`,
      },
    ],
  };
  return acc;
}, {});

// Các trang chính sách
export const ARTICLES = {
  "thong-tin-san-pham": {
    title: "Thông tin sản phẩm",
    body: [
      "Nạp Thẻ Ngay là nền tảng phân phối thẻ game trực tuyến do Công ty Cổ phần Funtek Việt Nam vận hành. Chúng tôi cung cấp mã thẻ của các nhà phát hành V-Coin, Garena, Zing, Appota, On Cash và Bit.",
      "Mỗi mã thẻ là một sản phẩm số, được cấp trực tiếp từ nhà phát hành và gửi tới email khách hàng ngay sau khi thanh toán thành công. Mã có giá trị sử dụng một lần.",
      "Ngoài thẻ game, website còn phân phối phụ kiện game, hàng công nghệ và hoa tươi. Các sản phẩm vật lý được giao theo Chính sách vận chuyển.",
    ],
  },
  "dieu-khoan-chung": {
    title: "Chính sách hoạt động / Điều khoản chung",
    body: [
      "Khi sử dụng website, bạn đồng ý cung cấp thông tin chính xác và chịu trách nhiệm về bảo mật tài khoản của mình.",
      "Nghiêm cấm sử dụng dịch vụ cho mục đích rửa tiền, gian lận thanh toán hoặc mua bán mã thẻ có nguồn gốc bất hợp pháp. Chúng tôi có quyền khoá tài khoản và từ chối giao dịch nếu phát hiện dấu hiệu vi phạm.",
      "Giá bán và mức chiết khấu có thể thay đổi theo từng thời điểm. Giá áp dụng cho một đơn hàng là giá hiển thị tại thời điểm khách hàng xác nhận thanh toán.",
      "Chúng tôi có quyền cập nhật điều khoản này. Phiên bản mới có hiệu lực kể từ khi được đăng tải trên website.",
    ],
  },
  "chinh-sach-doi-tra": {
    title: "Chính sách đổi trả và hoàn tiền",
    body: [
      "Mã thẻ đã được hiển thị cho khách hàng hoặc đã sử dụng không thuộc diện đổi trả, do đặc thù của sản phẩm số.",
      "Trường hợp mã thẻ lỗi, trùng hoặc đã bị sử dụng trước khi bàn giao, chúng tôi cấp lại mã mới hoặc hoàn 100% giá trị đơn hàng trong vòng 24 giờ kể từ khi tiếp nhận khiếu nại.",
      "Với sản phẩm vật lý, khách hàng được đổi trả trong 7 ngày kể từ ngày nhận hàng nếu sản phẩm còn nguyên tem, chưa qua sử dụng và có lỗi từ nhà sản xuất.",
      "Tiền hoàn được chuyển về đúng phương thức thanh toán ban đầu, thời gian xử lý 3–5 ngày làm việc.",
    ],
  },
  "chinh-sach-bao-mat": {
    title: "Chính sách bảo mật",
    body: [
      "Chúng tôi thu thập email, số điện thoại và lịch sử giao dịch nhằm mục đích cấp mã thẻ, xử lý thanh toán và hỗ trợ khách hàng.",
      "Thông tin thanh toán được xử lý trực tiếp bởi cổng thanh toán (MoMo, ZaloPay, ngân hàng). Website không lưu trữ số thẻ ngân hàng hay mã bảo mật của khách hàng.",
      "Chúng tôi không bán, trao đổi hay chuyển giao dữ liệu cá nhân cho bên thứ ba, trừ khi có yêu cầu từ cơ quan nhà nước có thẩm quyền.",
      "Khách hàng có quyền yêu cầu truy cập, chỉnh sửa hoặc xoá dữ liệu cá nhân bằng cách gửi email tới hotro@napthengay.vn.",
    ],
  },
  "chinh-sach-bao-hanh": {
    title: "Chính sách bảo hành",
    body: [
      "Mã thẻ game được bảo hành về tính hợp lệ: nếu mã không sử dụng được do lỗi phát hành, chúng tôi cấp lại mã mới miễn phí.",
      "Phụ kiện game và hàng công nghệ được bảo hành theo chính sách của nhà sản xuất, thời hạn 12–24 tháng tuỳ sản phẩm.",
      "Bảo hành không áp dụng cho hư hỏng do rơi vỡ, vào nước, tự ý tháo lắp hoặc sử dụng sai hướng dẫn.",
    ],
  },
  "chinh-sach-van-chuyen": {
    title: "Chính sách vận chuyển và giao hàng",
    body: [
      "Sản phẩm số (mã thẻ) được giao qua email, không phát sinh phí vận chuyển và không có thời gian chờ.",
      "Sản phẩm vật lý được giao qua đối tác vận chuyển: nội thành Hà Nội và TP.HCM 1–2 ngày, các tỉnh thành khác 3–5 ngày làm việc.",
      "Miễn phí vận chuyển cho đơn hàng từ 500.000đ. Đơn hàng dưới mức này chịu phí 30.000đ.",
      "Hoa tươi chỉ giao trong ngày tại khu vực nội thành, đặt trước tối thiểu 4 giờ.",
    ],
  },
  "chinh-sach-kiem-hang": {
    title: "Chính sách kiểm hàng",
    body: [
      "Khách hàng được kiểm tra hình thức bên ngoài của sản phẩm trước khi thanh toán cho nhân viên giao hàng.",
      "Với hàng công nghệ và phụ kiện, khách hàng được mở hộp kiểm tra ngoại quan và số lượng, chưa bao gồm dùng thử.",
      "Nếu phát hiện sản phẩm sai mẫu, thiếu hoặc hư hỏng, khách hàng có quyền từ chối nhận và không phải thanh toán.",
    ],
  },
  "quy-dinh-thanh-toan": {
    title: "Quy định và hình thức thanh toán",
    body: [
      "Website chấp nhận thanh toán qua Ví MoMo, ZaloPay và chuyển khoản ngân hàng. Mọi giao dịch được thực hiện bằng đồng Việt Nam (VNĐ).",
      "Đơn hàng chỉ được xử lý sau khi cổng thanh toán xác nhận thành công. Với chuyển khoản, thời gian xác nhận là 1–5 phút trong giờ hành chính.",
      "Giá hiển thị đã bao gồm thuế và chiết khấu, không phát sinh phí quản lý. Tổng tiền cuối cùng được tính lại và xác thực tại máy chủ trước khi tạo đơn.",
      "Nếu tiền đã trừ nhưng đơn hàng chưa được ghi nhận, vui lòng liên hệ hotline kèm mã giao dịch để được đối soát trong vòng 24 giờ.",
    ],
  },
};
