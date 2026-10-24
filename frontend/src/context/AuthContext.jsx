import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, clearToken, getToken, setToken } from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    api("/api/auth/me")
      .then(setUser)
      .catch(() => {
        clearToken();
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      async login(email, password, remember) {
        const data = await api("/api/auth/login", { method: "POST", body: { email, password, remember } });
        setToken(data.token, remember);
        setUser(data.user);
        return data.user;
      },
      async register(payload) {
        const data = await api("/api/auth/register", { method: "POST", body: payload });
        setToken(data.token, true);
        setUser(data.user);
        return data.user;
      },
      logout() {
        clearToken();
        setUser(null);
      },
      setUser,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
