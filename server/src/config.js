import "dotenv/config";

export const config = {
  port: Number(process.env.PORT) || 3000,

  // Để trống ở dev → server tự suy ra base URL từ request (LAN IP máy dev).
  // Ở production BẮT BUỘC đặt domain HTTPS công khai để VNPay gọi được IPN.
  publicBaseUrl: (process.env.PUBLIC_BASE_URL || "").replace(/\/$/, ""),

  appReturnUrl: process.env.APP_RETURN_URL || "napthengay://payment-result",

  vnp: {
    tmnCode: process.env.VNP_TMN_CODE || "",
    secureSecret: process.env.VNP_SECURE_SECRET || "",
    host: process.env.VNP_HOST || "https://sandbox.vnpayment.vn",
    testMode: (process.env.VNP_TEST_MODE || "true") === "true",
  },

  // DEV ONLY — xem .env.example. Không bao giờ bật ở production.
  devConfirmOnReturn: process.env.DEV_CONFIRM_ON_RETURN === "true",
};

export function assertConfig() {
  const missing = [];
  if (!config.vnp.tmnCode) missing.push("VNP_TMN_CODE");
  if (!config.vnp.secureSecret) missing.push("VNP_SECURE_SECRET");
  if (missing.length) {
    console.warn(
      `[VNPay] ⚠ Thiếu ${missing.join(", ")} trong .env — chưa tạo được URL thanh toán.\n` +
        `        Đăng ký sandbox tại https://sandbox.vnpayment.vn/devreg/ rồi điền vào server/.env`
    );
  }
  if (!config.publicBaseUrl && !config.devConfirmOnReturn) {
    console.warn(
      "[VNPay] ⚠ PUBLIC_BASE_URL trống và DEV_CONFIRM_ON_RETURN=false → IPN sẽ không tới được ở local."
    );
  }
}
