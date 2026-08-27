"use client";

import { AdminShell } from "@/components/admin/admin-shell";
import { UsersScreen } from "@/components/admin/users-screen";
import { useAdminAuth } from "@/lib/admin-api/auth-context";

export default function AdminUsersPage() {
  const { user, logout } = useAdminAuth();
  if (!user) return null;
  return <AdminShell user={user} onLogout={() => void logout()} state={user.is_superuser ? "ready" : "denied"}>{user.is_superuser && <UsersScreen />}</AdminShell>;
}
