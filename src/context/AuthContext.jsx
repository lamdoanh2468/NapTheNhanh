import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Platform } from "react-native";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

// Firebase native tự khởi tạo qua google-services.json trên iOS/Android, nhưng KHÔNG có
// trên web (bản react-native-web dùng để chia sẻ qua QR). Nên trên web ta bỏ qua mọi lệnh
// Firebase để app vẫn tải & duyệt được; đăng nhập chỉ khả dụng trên app di động.
const IS_WEB = Platform.OS === "web";
const WEB_ONLY_MSG = "Đăng nhập hiện chỉ khả dụng trên ứng dụng di động (bản web chỉ để xem).";

/**
 * Xác thực bằng Firebase Auth (native — cần development build, KHÔNG chạy trong Expo Go).
 * Hai phương thức: đăng nhập bằng số điện thoại (OTP) và bằng Google (Gmail).
 * Firebase tự lưu phiên đăng nhập giữa các lần mở app → không cần AsyncStorage.
 */

// Web client ID lấy từ google-services.json (oauth_client có client_type = 3).
// Bắt buộc cho Google Sign-In để đổi idToken thành credential Firebase.
const WEB_CLIENT_ID =
  "52731642236-3stqki0bar07gtjcpcn8isnn18cbvv8q.apps.googleusercontent.com";

if (!IS_WEB) {
  GoogleSignin.configure({ webClientId: WEB_CLIENT_ID });
}

const AuthCtx = createContext(null);

// Chuẩn hoá user của Firebase về đúng shape mà phần còn lại của app đang dùng.
function mapUser(fb) {
  if (!fb) return null;
  return {
    id: fb.uid,
    email: fb.email || "",
    phone: fb.phoneNumber || "",
    name: fb.displayName || "",
    photo: fb.photoURL || "",
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // chờ Firebase phát trạng thái phiên đầu tiên

  useEffect(() => {
    // Web: không có Firebase → không có phiên đăng nhập, chỉ để duyệt.
    if (IS_WEB) {
      setLoading(false);
      return;
    }
    // onAuthStateChanged phát ngay user hiện tại (hoặc null), rồi mỗi khi đăng nhập/xuất.
    const unsubscribe = auth().onAuthStateChanged((fb) => {
      setUser(mapUser(fb));
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Đăng nhập Google: đăng nhập lấy token → đổi thành credential Firebase → signIn.
  const signInWithGoogle = useCallback(async () => {
    if (IS_WEB) throw new Error(WEB_ONLY_MSG);
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const response = await GoogleSignin.signIn();
    if (response?.type === "cancelled") {
      throw new Error("Đã huỷ đăng nhập Google.");
    }
    // Lấy CẢ idToken lẫn accessToken. Trên New Architecture, tạo credential Google mà
    // accessToken rỗng sẽ bị Firebase native ném "accessToken cannot be empty" → phải
    // truyền accessToken thật (getTokens trả về token đã cấp sau signIn).
    const { idToken, accessToken } = await GoogleSignin.getTokens();
    if (!idToken) throw new Error("Không lấy được Google ID token.");
    const credential = auth.GoogleAuthProvider.credential(idToken, accessToken);
    await auth().signInWithCredential(credential);
  }, []);

  // Gửi OTP tới số điện thoại dạng E.164 (+84...). Trả về confirmation để xác nhận mã.
  const sendOtp = useCallback((e164) => {
    if (IS_WEB) throw new Error(WEB_ONLY_MSG);
    return auth().signInWithPhoneNumber(e164);
  }, []);

  const logout = useCallback(async () => {
    if (IS_WEB) return;
    try {
      await GoogleSignin.signOut();
    } catch {
      // user không đăng nhập bằng Google → bỏ qua
    }
    await auth().signOut();
  }, []);

  return (
    <AuthCtx.Provider value={{ user, loading, signInWithGoogle, sendOtp, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
