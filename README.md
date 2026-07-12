# Nạp Thẻ Ngay — React Native (Expo)

```bash
npm install
npx expo start        # quét QR bằng Expo Go
```

## Web → Native: cái gì đổi

| Web                       | React Native                                                        |
| ------------------------- | ------------------------------------------------------------------- |
| `react-router-dom`, URL   | `@react-navigation` — Bottom Tabs + Stack                           |
| TailwindCSS               | `src/theme/index.js` (token) + `StyleSheet`                         |
| `<div> <button> <input>`  | `<View> <Pressable> <TextInput>`                                    |
| `localStorage` (đồng bộ)  | `AsyncStorage` (**bất đồng bộ** → `AuthContext` có state `loading`) |
| `navigator.clipboard`     | `expo-clipboard`                                                    |
| `position: fixed` (Toast) | `position: absolute` + `Animated`                                   |
| `<select>` lọc lịch sử    | Chip cuộn ngang                                                     |
| Footer (mọi trang)        | Tab **Tài khoản**                                                   |
| `useEffect` tải dữ liệu   | `useFocusEffect` (tab bị giữ trong bộ nhớ)                          |
| `toLocaleString("vi-VN")` | Tự format — Hermes không kèm full-ICU                               |
| `box-shadow`              | `shadow*` (iOS) + `elevation` (Android)                             |
| `lucide-react`            | `lucide-react-native`                                               |

## Giữ nguyên (~90% logic)

`data/catalog.js`, `utils/api.js`, `utils/format.js`, `context/AuthContext.jsx` —
luồng đơn `PENDING → PAID → DELIVERED`, idempotency key, `quotePrice()`.

## Khi nối backend

Sửa `src/utils/api.js` (mọi hàm có `TODO(server)`).

- **`quotePrice()` + `createOrder()` phải chuyển sang server.** Giá tính ở client → sửa được.
- **JWT dùng `expo-secure-store`, KHÔNG dùng AsyncStorage** (AsyncStorage không mã hoá).
- Thanh toán: mở `payUrl` bằng `expo-web-browser` (MoMo/ZaloPay deep link), server nhận IPN callback rồi mới cấp mã.
