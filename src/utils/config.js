import Constants from "expo-constants";

// URL của backend VNPay (server/).
// - Production: đặt biến môi trường EXPO_PUBLIC_API_URL (vd https://api.napthengay.vn).
// - Dev: Expo cho biết IP máy dev qua hostUri ("192.168.x.x:8081"); backend chạy cùng máy
//   ở cổng 3000 nên ta tự suy ra để điện thoại thật kết nối được (localhost trên điện thoại
//   là chính nó, không phải máy tính).
const devHost = Constants.expoConfig?.hostUri?.split(":")[0];

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  (devHost ? `http://${devHost}:3000` : "http://localhost:3000");

// URL giao diện web của app (bản react-native-web) — dùng để hiện mã QR chia sẻ.
// - Production: đặt EXPO_PUBLIC_WEB_URL = URL web đã deploy (vd https://app.napthengay.vn).
// - Dev: để trống → tự dùng http://<IP máy dev>:8082 (chạy `expo start --web`), người
//   cùng mạng WiFi quét là mở được. Trên emulator (localhost) thì link chỉ máy đó mở được,
//   nên khi demo thật hãy đặt EXPO_PUBLIC_WEB_URL hoặc chạy trên điện thoại thật cùng WiFi.
export const WEB_APP_URL =
  process.env.EXPO_PUBLIC_WEB_URL ||
  (devHost ? `http://${devHost}:8082` : "https://napthengay.vn");

// Return URL sau thanh toán được sinh động bằng expo-linking (xem src/utils/api.js)
// để chạy đúng cả trong Expo Go (exp://…) lẫn bản build standalone (napthengay://…).
