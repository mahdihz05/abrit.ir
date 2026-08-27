"use client";

import { AdminShell } from "@/components/admin/admin-shell";
import { AuditScreen } from "@/components/admin/audit-screen";
import { useAdminAuth } from "@/lib/admin-api/auth-context";

export default function AuditPage() {
  const { user, logout } = useAdminAuth();
  if (!user) return null;
  return <AdminShell user={user} onLogout={() => void logout()}><AuditScreen /></AdminShell>;
}
