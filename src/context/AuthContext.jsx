// src/context/AuthContext.jsx
import { createContext, useEffect, useMemo, useState } from "react";
import AuthService from "../services/authService";
import { ACCESS_KEY } from "../api/api";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_KEY);
    if (!token) { setReady(true); return; }
    AuthService.me()
      .then(setUser)
      .catch(() => localStorage.removeItem(ACCESS_KEY))
      .finally(() => setReady(true));
  }, []);

  const login = async ({ nif, password }) => {
    const data = await AuthService.login({ nif, password });
    if (data?.user) setUser(data.user);
    else {
      try { setUser(await AuthService.me()); } catch { /* empty */ }
    }
  };

  const logout = async () => {
    await AuthService.logout();
    setUser(null);
  };

  const value = useMemo(() => ({ user, ready, login, logout }), [user, ready]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
