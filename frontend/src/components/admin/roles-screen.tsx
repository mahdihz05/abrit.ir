"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminApiRequestError, getAdminPermissions, getAdminRole, getAdminRoles } from "@/lib/admin-api/client";
import type { PermissionDefinition, RoleDefinition } from "@/lib/admin-api/types";

type RolesState = "loading" | "ready" | "denied" | "error";

const categoryLabels: Record<string, string> = {
  accounts: "حساب‌ها و مدیریت",
  content: "محتوا",
  forms: "فرم‌ها و ارسال‌ها",
  media: "رسانه",
  core: "گزارش رویدادها",
};

const roleLabels: Record<RoleDefinition["key"], string> = {
  editor: "ویرایشگر",
  publisher: "ناشر",
  "submission-reviewer": "بررسی‌کننده ارسال‌ها",
  auditor: "حسابرسی‌کننده",
};

function roleLabel(role: RoleDefinition) {
  return roleLabels[role.key] ?? role.name;
}

export function RolesScreen() {
  const [state, setState] = useState<RolesState>("loading");
  const [roles, setRoles] = useState<RoleDefinition[]>([]);
  const [permissions, setPermissions] = useState<PermissionDefinition[]>([]);
  const [selectedKey, setSelectedKey] = useState<RoleDefinition["key"] | null>(null);
  const [selectedRole, setSelectedRole] = useState<RoleDefinition | null>(null);
  const [search, setSearch] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const loadCatalog = useCallback(async () => {
    setState("loading");
    setErrorMessage("");
    try {
      const [roleData, permissionData] = await Promise.all([getAdminRoles(), getAdminPermissions()]);
      setRoles(roleData);
      setPermissions(permissionData);
      setSelectedKey((current) => current && roleData.some((role) => role.key === current) ? current : roleData[0]?.key ?? null);
      setState("ready");
    } catch (error) {
      setState(error instanceof AdminApiRequestError && error.status === 403 ? "denied" : "error");
      setErrorMessage(error instanceof Error ? error.message : "بارگذاری نقش‌ها ممکن نشد.");
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => { void loadCatalog(); }, 0);
    return () => window.clearTimeout(timer);
  }, [loadCatalog]);

  useEffect(() => {
    if (!selectedKey || !roles.some((role) => role.key === selectedKey)) return;
    let active = true;
    void getAdminRole(selectedKey).then((role) => {
      if (active) setSelectedRole(role);
    }).catch(() => {
      if (active) setSelectedRole(roles.find((role) => role.key === selectedKey) ?? null);
    });
    return () => { active = false; };
  }, [roles, selectedKey]);

  const filteredRoles = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    if (!query) return roles;
    return roles.filter((role) => `${role.name} ${roleLabel(role)} ${role.description}`.toLocaleLowerCase().includes(query));
  }, [roles, search]);

  const visiblePermissions = useMemo(() => {
    if (!selectedRole) return [];
    const query = search.trim().toLocaleLowerCase();
    return permissions.filter((permission) => selectedRole.permissions.includes(permission.key) && (!query || `${permission.key} ${permission.label} ${permission.category}`.toLocaleLowerCase().includes(query)));
  }, [permissions, search, selectedRole]);

  const groupedPermissions = useMemo(() => visiblePermissions.reduce<Record<string, PermissionDefinition[]>>((groups, permission) => {
    (groups[permission.category] ??= []).push(permission);
    return groups;
  }, {}), [visiblePermissions]);

  const displayRole = selectedRole?.key === selectedKey ? selectedRole : null;

  if (state === "loading") return <section className="admin-section roles-state" aria-live="polite"><span className="admin-state-badge">در حال بارگذاری</span><h1>نقش‌ها و دسترسی‌ها</h1><p>فهرست نقش‌ها و مجوزهای سیستم در حال آماده‌سازی است.</p></section>;
  if (state === "denied") return <section className="admin-section roles-state" role="alert"><span className="admin-state-badge">دسترسی محدود</span><h1>مشاهده نقش‌ها ممکن نیست</h1><p>نقش فعلی شما اجازه مشاهده فهرست نقش‌ها و دسترسی‌ها را ندارد.</p></section>;
  if (state === "error") return <section className="admin-section roles-state" role="alert"><span className="admin-state-badge">خطا</span><h1>بارگذاری نقش‌ها ناموفق بود</h1><p>{errorMessage || "لطفاً دوباره تلاش کنید."}</p><button type="button" className="roles-retry" onClick={() => void loadCatalog()}>تلاش دوباره</button></section>;

  return <section aria-labelledby="roles-title">
    <span className="admin-eyebrow">ACCESS CONTROL</span>
    <h1 id="roles-title">نقش‌ها و دسترسی‌ها</h1>
    <p className="admin-intro">نقش‌های ثابت AbrIT و مجوزهای هر نقش را مشاهده کنید. این صفحه فقط خواندنی است.</p>
    <div className="roles-notice" role="note"><strong>نقش‌های رزروشده و تغییرناپذیر</strong><span>این نقش‌ها بخشی از سیاست امنیتی سیستم هستند و نام، مجوزها یا وضعیت آن‌ها از اینجا قابل تغییر نیست.</span></div>
    <label className="roles-search" htmlFor="roles-search"><span>جستجو در نقش‌ها و دسترسی‌ها</span><input id="roles-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="مثلاً انتشار یا content" /></label>
    <div className="roles-layout">
      <div className="roles-list-panel" role="region" aria-labelledby="roles-list-title"><div className="roles-panel-heading"><h2 id="roles-list-title">نقش‌ها</h2><span>{filteredRoles.length} نقش</span></div><div className="roles-list">{filteredRoles.map((role) => <button type="button" className="role-list-item" data-selected={role.key === selectedKey} aria-pressed={role.key === selectedKey} key={role.key} onClick={() => setSelectedKey(role.key)}><span><strong>{roleLabel(role)}</strong><small>{role.name}</small></span><span className="role-arrow" aria-hidden="true">←</span></button>)}{filteredRoles.length === 0 && <p className="roles-empty">نقشی با این جستجو پیدا نشد.</p>}</div></div>
      <div className="role-detail" aria-live="polite">{displayRole ? <><div className="role-detail-heading"><div><span className="admin-state-badge">نقش رزروشده</span><h2>{roleLabel(displayRole)}</h2><p>{displayRole.description}</p></div><div className="role-key">{displayRole.key}</div></div><div className="role-facts"><div><small>وضعیت</small><strong>غیرقابل تغییر</strong></div><div><small>نیاز به دسترسی Staff</small><strong>{displayRole.requires_django_staff ? "بله" : "خیر"}</strong></div><div><small>تعداد دسترسی‌ها</small><strong>{displayRole.permissions.length}</strong></div></div><div className="permissions-heading"><h3>دسترسی‌های این نقش</h3><span>{visiblePermissions.length} مورد</span></div>{Object.keys(groupedPermissions).length > 0 ? <div className="permission-groups">{Object.entries(groupedPermissions).map(([category, items]) => <section className="permission-group" key={category} aria-labelledby={`permission-category-${category}`}><h4 id={`permission-category-${category}`}>{categoryLabels[category] ?? category}</h4><ul>{items.map((permission) => <li key={permission.key}><span><strong>{permission.label}</strong><small>{permission.key}</small></span><em>{permission.source === "custom" ? "اختصاصی" : "Django"}</em></li>)}</ul></section>)}</div> : <p className="roles-empty">دسترسی منطبق با جستجو پیدا نشد.</p>}<p className="staff-note"><strong>نکته درباره Staff:</strong> {displayRole.requires_django_staff ? "کاربر دارای این نقش باید برای ورود به پنل مدیریت، Staff باشد." : "این نقش برای مشاهده گزارش‌ها به Staff بودن کاربر نیاز ندارد."}</p></> : <p className="roles-empty">یک نقش را برای مشاهده جزئیات انتخاب کنید.</p>}</div>
    </div>
  </section>;
}
