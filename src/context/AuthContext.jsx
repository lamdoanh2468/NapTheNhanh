import { createContext, useContext, useState, useEffect, useCallback } from "react";
import * as api from "../utils/api";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // AsyncStorage bất đồng bộ → phải có trạng thái chờ

  useEffect(() => {
    api.getSession().then((u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  const login = useCallback(async (creds) => {
    const u = await api.login(creds);
    setUser(u);
    return u;
  }, []);

  const register = useCallback(async (creds) => {
    const u = await api.register(creds);
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(async () => {
    await api.logout();
    setUser(null);
  }, []);

  return (
    <AuthCtx.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
