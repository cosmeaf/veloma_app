import { useEffect, useMemo, useState } from "react";
import AuthService from "../services/authService";
import { ACCESS_KEY } from "../api/api";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const has = localStorage.getItem(ACCESS_KEY);
    if (has) setUser({ username: "session" });
    setReady(true);
  }, []);

  const login = async ({ username, password }) => {
    const data = await AuthService.login({ username, password });
    setUser(data?.user || { username });
    return data;
  };

  const logout = async () => {
    await AuthService.logout();
    setUser(null);
  };

  const value = useMemo(() => ({ user, ready, login, logout }), [user, ready]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
