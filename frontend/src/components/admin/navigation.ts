export type AdminPermission = string;

export interface AdminNavigationItem {
  id: string;
  label: string;
  href: string;
  icon: string;
  permission?: AdminPermission;
}

export const adminNavigationRegistry: readonly AdminNavigationItem[] = [
  { id: "overview", label: "نمای کلی", href: "/admin", icon: "01" },
  { id: "content", label: "محتوا", href: "/admin/content", icon: "02", permission: "content.view" },
  { id: "submissions", label: "ارسال‌ها", href: "/admin/submissions", icon: "03", permission: "submissions.view" },
  { id: "users", label: "کاربران", href: "/admin/users", icon: "04", permission: "users.view" },
  { id: "audit", label: "گزارش رویدادها", href: "/admin/audit", icon: "05", permission: "audit.view" },
];

export function filterAdminNavigation(items: readonly AdminNavigationItem[], permissions: readonly string[], isSuperuser = false) {
  return items.filter((item) => !item.permission || isSuperuser || permissions.includes(item.permission));
}
