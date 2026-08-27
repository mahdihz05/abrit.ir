"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { AdminSession, SessionUser } from "./types";
import { AdminApiRequestError, bootstrapCsrf, getAdminSession, loginAdmin, logoutAdmin } from "./client";

type AuthStatus = "loading" | "authenticated" | "unauthenticated" | "expired" | "denied";
interface AdminAuthContextValue {
  status: AuthStatus;
  user: SessionUser | null;
  refresh: () => Promise<void>;
  login: (username: string, password: string) => Promise<AdminSession>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<SessionUser | null>(null);

  const refresh = useCallback(async () => {
    try {
      await bootstrapCsrf();
      const session = await getAdminSession();
      setUser(session.user);
      setStatus("authenticated");
    } catch (error) {
      setUser(null);
      if (error instanceof AdminApiRequestError && error.status === 403) setStatus("denied");
      else setStatus((current) => current === "authenticated" ? "expired" : "unauthenticated");
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => { void refresh(); }, 0);
    return () => window.clearTimeout(timer);
  }, [refresh]);

  const login = useCallback(async (username: string, password: string) => {
    await bootstrapCsrf();
    const session = await loginAdmin(username, password);
    setUser(session.user);
    setStatus("authenticated");
    return session;
  }, []);

  const logout = useCallback(async () => {
    await logoutAdmin();
    setUser(null);
    setStatus("unauthenticated");
  }, []);

  const value = useMemo(() => ({ status, user, refresh, login, logout }), [status, user, refresh, login, logout]);
  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const value = useContext(AdminAuthContext);
  if (!value) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return value;
}
