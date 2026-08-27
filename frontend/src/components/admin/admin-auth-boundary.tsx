"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { AdminShell } from "./admin-shell";
import { useAdminAuth } from "@/lib/admin-api/auth-context";

export function AdminAuthBoundary({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { status, user } = useAdminAuth();
  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    if (!isLogin && status === "unauthenticated") router.replace(`/admin/login?next=${encodeURIComponent(pathname)}`);
  }, [isLogin, pathname, router, status]);

  if (isLogin) return <>{children}</>;
  if (status === "loading") return <AdminShell state="loading" />;
  if (status === "expired") return <AdminShell state="expired" />;
  if (status === "denied") return <AdminShell state="denied" />;
  if (status === "unauthenticated" || !user) return null;
  return <>{children}</>;
}
