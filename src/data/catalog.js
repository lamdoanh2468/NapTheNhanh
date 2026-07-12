// Dữ liệu danh mục — khi có backend, thay bằng GET /api/catalog
import { Gamepad2, Headphones, Cpu, Flower2 } from "lucide-react-native";
import { ImageBackground } from "react-native";
import momoIcon from "../imgs/momo_icon.png";
import zaloIcon from "../imgs/zalo_icon.png";
import bankIcon from "../imgs/bank_icon.png";

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
  { id: "v-coin", name: "V-Coin", color: "#e63946", discount: 0.03 },
  { id: "garena", name: "Garena", color: "#f77f00", discount: 0.02 },
  { id: "zing", name: "Zing", color: "#1d4ed8", discount: 0.025 },
  { id: "appota", name: "Appota", color: "#0891b2", discount: 0.04 },
  { id: "gate", name: "Gate", color: "#7c3aed", discount: 0.03 },
  { id: "oncash", name: "On Cash", color: "#059669", discount: 0.05 },
  { id: "bit", name: "Bit", color: "#db2777", discount: 0.02 },
];

export const DENOMINATIONS = [
  10000, 20000, 50000, 100000, 200000, 500000, 1000000,
];

export const PAYMENTS = [
  {
    id: "momo",
    name: "Ví MoMo",
    note: "Thanh toán tức thì",
    ImageBackground: momoIcon,
  },
  {
    id: "zalopay",
    name: "ZaloPay",
    note: "Miễn phí giao dịch",
    ImageBackground: zaloIcon,
  },
  {
    id: "bank",
    name: "Chuyển khoản",
    note: "Xác nhận 1–5 phút",
    ImageBackground: bankIcon,
  },
];

export const PRODUCTS = {
  accessory: [
    { id: "a1", name: "Tai nghe gaming HyperX Cloud II", price: 1890000 },
    { id: "a2", name: "Chuột Logitech G Pro X Superlight", price: 2790000 },
    { id: "a3", name: "Bàn phím cơ Akko 3068B", price: 1450000 },
    { id: "a4", name: "Lót chuột Razer Gigantus V2", price: 390000 },
  ],
  tech: [
    { id: "t1", name: "Sạc dự phòng Anker 20.000mAh", price: 890000 },
    { id: "t2", name: "Ổ cứng SSD Samsung 980 1TB", price: 2190000 },
    { id: "t3", name: "Webcam Logitech C920", price: 1590000 },
  ],
  flower: [
    { id: "f1", name: "Bó hồng đỏ 20 bông", price: 650000 },
    { id: "f2", name: "Giỏ hoa tulip pastel", price: 890000 },
    { id: "f3", name: "Hộp hoa baby trắng", price: 450000 },
  ],
};

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
      "Nạp Thẻ Ngay là nền tảng phân phối thẻ game trực tuyến do Công ty Cổ phần Funtek Việt Nam vận hành. Chúng tôi cung cấp mã thẻ của các nhà phát hành V-Coin, Garena, Zing, Appota, Gate, On Cash và Bit.",
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
