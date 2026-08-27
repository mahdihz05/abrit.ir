export type AdminPermission = string;

export interface AdminNavigationItem {
  id: string;
  label: string;
  href: string;
  icon: string;
  permission?: AdminPermission;
  superuserOnly?: boolean;
}

export const adminNavigationRegistry: readonly AdminNavigationItem[] = [
  { id: "overview", label: "نمای کلی", href: "/admin", icon: "01", permission: "accounts.view_dashboard" },
  { id: "content", label: "محتوا", href: "/admin/content", icon: "02", permission: "content.view_contentitem" },
  { id: "submissions", label: "ارسال‌ها", href: "/admin/submissions", icon: "03", permission: "forms.view_formsubmission" },
  { id: "users", label: "کاربران", href: "/admin/users", icon: "04", superuserOnly: true },
  { id: "roles", label: "نقش‌ها و دسترسی‌ها", href: "/admin/roles", icon: "05", permission: "accounts.view_role_catalog" },
  { id: "audit", label: "گزارش رویدادها", href: "/admin/audit", icon: "06", permission: "core.view_auditlog" },
];

export function filterAdminNavigation(items: readonly AdminNavigationItem[], permissions: readonly string[], isSuperuser = false) {
  return items.filter((item) => (!item.superuserOnly && (!item.permission || isSuperuser || permissions.includes(item.permission))) || (item.superuserOnly && isSuperuser));
}
