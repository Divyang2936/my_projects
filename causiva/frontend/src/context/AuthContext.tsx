import React, { createContext, useContext, useEffect, useState } from "react";
import { api, ApiUser } from "../lib/api";

type AuthContextValue = { user: ApiUser | null; loading: boolean; login: (email: string, password: string) => Promise<void>; register: (payload: { email: string; password: string; firstName: string; lastName: string }) => Promise<void>; logout: () => Promise<void>; refresh: () => Promise<void> };
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [loading, setLoading] = useState(true);
  const refresh = async () => {
    try { await api.csrf(); setUser(await api.me()); } catch { setUser(null); }
  };
  useEffect(() => { refresh().finally(() => setLoading(false)); }, []);
  const login = async (email: string, password: string) => { setUser(await api.login({ email, password })); };
  const register = async (payload: { email: string; password: string; firstName: string; lastName: string }) => { setUser(await api.register(payload)); };
  const logout = async () => { try { await api.logout(); } finally { setUser(null); } };
  return <AuthContext.Provider value={{ user, loading, login, register, logout, refresh }}>{children}</AuthContext.Provider>;
};
export const useAuth = () => { const context = useContext(AuthContext); if (!context) throw new Error("useAuth must be used within an AuthProvider"); return context; };
