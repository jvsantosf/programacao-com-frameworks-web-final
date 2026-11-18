import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { api, setUnauthorizedHandler, tokenStorage } from "../lib/api";
import type { AuthResponse, User } from "../types";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(() => tokenStorage.get() !== null);

  const logout = useCallback(() => {
    tokenStorage.clear();
    setUser(null);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(logout);
    if (!tokenStorage.get()) return;

    api<User>("/auth/me")
      .then(setUser)
      .catch(logout)
      .finally(() => setLoading(false));
  }, [logout]);

  const authenticate = useCallback((response: AuthResponse) => {
    tokenStorage.set(response.token);
    setUser(response.user);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      authenticate(await api<AuthResponse>("/auth/login", { method: "POST", body: { email, password } }));
    },
    [authenticate],
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      authenticate(await api<AuthResponse>("/auth/register", { method: "POST", body: { name, email, password } }));
    },
    [authenticate],
  );

  const value = useMemo(
    () => ({ user, loading, login, register, logout }),
    [user, loading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
