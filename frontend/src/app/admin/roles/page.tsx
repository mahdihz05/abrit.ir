"use client";

import { AdminShell } from "@/components/admin/admin-shell";
import { RolesScreen } from "@/components/admin/roles-screen";
import { useAdminAuth } from "@/lib/admin-api/auth-context";

export default function AdminRolesPage() {
  const { user, logout } = useAdminAuth();
  if (!user) return null;
  return <AdminShell user={user} onLogout={() => void logout()}><RolesScreen /></AdminShell>;
}
