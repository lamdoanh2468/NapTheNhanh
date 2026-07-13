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

// Deep link app nhận sau khi thanh toán xong (khớp "scheme" trong app.json + APP_RETURN_URL server).
export const PAYMENT_RETURN_URL = "napthengay://payment-result";
