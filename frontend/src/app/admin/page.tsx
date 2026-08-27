"use client";

import { AdminShell } from "@/components/admin/admin-shell";
import { useAdminAuth } from "@/lib/admin-api/auth-context";
import { AdminDashboard } from "./dashboard";

export default function AdminPage() {
  const { user, logout } = useAdminAuth();
  if (!user) return null;
  return <AdminShell user={user} onLogout={() => void logout()}><AdminDashboard /></AdminShell>;
}
