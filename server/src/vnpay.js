import { VNPay, ignoreLogger } from "vnpay";
import { config } from "./config.js";

// Một instance dùng chung. secureSecret chỉ tồn tại ở server này — không bao giờ gửi ra client.
export const vnpay = new VNPay({
  tmnCode: config.vnp.tmnCode,
  secureSecret: config.vnp.secureSecret,
  vnpayHost: config.vnp.host,
  testMode: config.vnp.testMode,
  hashAlgorithm: "SHA512",
  // Tắt log mặc định của thư viện; bật consoleLogger nếu cần debug.
  loggerFn: ignoreLogger,
});
