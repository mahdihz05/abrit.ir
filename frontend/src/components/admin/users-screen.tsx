"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import type { AdminUser, FixedRoleKey } from "@/lib/admin-api/types";
import { AdminApiRequestError, changeAdminUserPassword, createAdminUser, getAdminUsers, setAdminUserActive, updateAdminUser } from "@/lib/admin-api/client";

const roles: Array<{ key: FixedRoleKey; label: string }> = [
  { key: "editor", label: "ویراستار" },
  { key: "publisher", label: "ناشر" },
  { key: "submission-reviewer", label: "بررسی‌کننده ارسال‌ها" },
  { key: "auditor", label: "حسابرسی" },
];

type FormMode = "create" | "edit" | "password";
type ConfirmAction = { user: AdminUser; active: boolean } | null;

const errorMessages: Record<string, string> = {
  authentication_required: "نشست شما معتبر نیست. دوباره وارد شوید.",
  permission_denied: "فقط ابرکاربر می‌تواند کاربران را مدیریت کند.",
  not_found: "کاربر پیدا نشد. فهرست را تازه‌سازی کنید.",
  superuser_protected: "حساب‌های ابرکاربر از این مسیر قابل تغییر نیستند.",
  self_lockout: "نمی‌توانید حساب خودتان را غیرفعال کنید.",
  reserved_role: "نقش انتخاب‌شده معتبر نیست.",
  validation_error: "اطلاعات واردشده را بررسی کنید.",
};

function apiError(error: unknown) {
  if (error instanceof AdminApiRequestError) return errorMessages[error.code] ?? error.message;
  return "خطایی رخ داد. دوباره تلاش کنید.";
}

function roleLabel(user: AdminUser) { return user.role?.name ?? "بدون نقش"; }

function emptyForm(user?: AdminUser) {
  return { username: user?.username ?? "", email: user?.email ?? "", first_name: user?.first_name ?? "", last_name: user?.last_name ?? "", role: user?.role?.key ?? "" as string, password: "" };
}

export function UsersScreen() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [meta, setMeta] = useState({ page: 1, page_size: 20, total: 0, total_pages: 0 });
  const [query, setQuery] = useState({ search: "", status: "" as "" | "active" | "inactive", role: "", page: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<FormMode | null>(null);
  const [selected, setSelected] = useState<AdminUser | undefined>();
  const [form, setForm] = useState(emptyForm());
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirm, setConfirm] = useState<ConfirmAction>(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const result = await getAdminUsers({ page: query.page, page_size: 20, search: query.search, status: query.status || undefined, role: query.role || undefined, ordering: "username" });
      setUsers(result.data); setMeta(result.meta);
    } catch (requestError) { setError(apiError(requestError)); }
    finally { setLoading(false); }
  }, [query]);

  useEffect(() => { const timer = window.setTimeout(() => { void load(); }, 0); return () => window.clearTimeout(timer); }, [load]);

  const openForm = (nextMode: FormMode, user?: AdminUser) => { setMode(nextMode); setSelected(user); setForm(emptyForm(user)); setFormError(null); };
  const closeForm = () => { if (!saving) setMode(null); };
  const updateField = (field: keyof ReturnType<typeof emptyForm>, value: string) => setForm((current) => ({ ...current, [field]: value }));

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setFormError(null); setSaving(true);
    try {
      if (mode === "password" && selected) await changeAdminUserPassword(selected.id, form.password);
      else if (mode === "edit" && selected) await updateAdminUser(selected.id, { username: form.username, email: form.email, first_name: form.first_name, last_name: form.last_name, role: form.role || null });
      else if (mode === "create") await createAdminUser({ username: form.username, email: form.email, first_name: form.first_name, last_name: form.last_name, role: form.role || null, password: form.password, is_active: true });
      setMode(null); await load();
    } catch (requestError) { setFormError(apiError(requestError)); }
    finally { setSaving(false); }
  }

  async function confirmActivation() {
    if (!confirm) return;
    setSaving(true); setFormError(null);
    try { await setAdminUserActive(confirm.user.id, confirm.active); setConfirm(null); await load(); }
    catch (requestError) { setFormError(apiError(requestError)); setConfirm(null); }
    finally { setSaving(false); }
  }

  const formTitle = useMemo(() => mode === "create" ? "افزودن کاربر" : mode === "password" ? "تغییر گذرواژه" : "ویرایش کاربر", [mode]);
  return <section className="admin-users" aria-labelledby="users-title">
    <div className="admin-page-heading"><div><span className="admin-eyebrow">IDENTITY MANAGEMENT</span><h1 id="users-title">کاربران</h1><p className="admin-intro">حساب‌ها و نقش‌های دسترسی پنل مدیریت را کنترل کنید.</p></div><button className="admin-primary-button" type="button" onClick={() => openForm("create")}>افزودن کاربر</button></div>
    {error && <div className="admin-alert" role="alert">{error}<button type="button" onClick={() => void load()}>تلاش دوباره</button></div>}
    <div className="admin-toolbar" aria-label="فیلتر کاربران"><label>جست‌وجو<input aria-label="جست‌وجوی کاربر" value={query.search} onChange={(event) => setQuery((current) => ({ ...current, search: event.target.value, page: 1 }))} placeholder="نام کاربری، ایمیل یا نام" /></label><label>وضعیت<select aria-label="فیلتر وضعیت" value={query.status} onChange={(event) => setQuery((current) => ({ ...current, status: event.target.value as typeof query.status, page: 1 }))}><option value="">همه</option><option value="active">فعال</option><option value="inactive">غیرفعال</option></select></label><label>نقش<select aria-label="فیلتر نقش" value={query.role} onChange={(event) => setQuery((current) => ({ ...current, role: event.target.value, page: 1 }))}><option value="">همه نقش‌ها</option>{roles.map((role) => <option key={role.key} value={role.key}>{role.label}</option>)}</select></label></div>
    <div className="admin-section admin-table-wrap"><div className="admin-table-heading"><h2>فهرست کاربران</h2><span>{meta.total} حساب</span></div>{loading ? <p className="admin-table-state" role="status">در حال بارگذاری کاربران…</p> : users.length === 0 ? <p className="admin-table-state">کاربری با این فیلتر پیدا نشد.</p> : <div className="admin-table-scroll"><table><caption className="sr-only">فهرست کاربران مدیریت</caption><thead><tr><th scope="col">کاربر</th><th scope="col">نقش</th><th scope="col">وضعیت</th><th scope="col">عملیات</th></tr></thead><tbody>{users.map((user) => <tr key={user.id}><td><strong>{user.first_name || user.last_name ? `${user.first_name} ${user.last_name}`.trim() : user.username}</strong><small>{user.username} · {user.email || "بدون ایمیل"}</small></td><td>{roleLabel(user)}{user.is_superuser && <small>ابرکاربر</small>}</td><td><span className={`admin-status ${user.is_active ? "is-active" : "is-inactive"}`}>{user.is_active ? "فعال" : "غیرفعال"}</span>{user.is_locked && <small>قفل موقت</small>}</td><td><div className="admin-row-actions"><button type="button" onClick={() => openForm("edit", user)} disabled={user.is_superuser}>ویرایش</button><button type="button" onClick={() => openForm("password", user)} disabled={user.is_superuser}>گذرواژه</button><button type="button" onClick={() => setConfirm({ user, active: !user.is_active })} disabled={user.is_superuser}>{user.is_active ? "غیرفعال‌سازی" : "فعال‌سازی"}</button></div></td></tr>)}</tbody></table></div>}</div>
    {meta.total_pages > 1 && <nav className="admin-pagination" aria-label="صفحه‌های کاربران"><button type="button" disabled={query.page <= 1} onClick={() => setQuery((current) => ({ ...current, page: current.page - 1 }))}>قبلی</button><span>صفحه {meta.page} از {meta.total_pages}</span><button type="button" disabled={query.page >= meta.total_pages} onClick={() => setQuery((current) => ({ ...current, page: current.page + 1 }))}>بعدی</button></nav>}
    {mode && <div className="admin-modal-backdrop"><section className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="user-form-title"><div className="admin-modal-heading"><h2 id="user-form-title">{formTitle}</h2><button type="button" aria-label="بستن فرم" onClick={closeForm}>×</button></div><form onSubmit={submit}>{mode !== "password" && <><label htmlFor="user-username">نام کاربری</label><input id="user-username" value={form.username} onChange={(event) => updateField("username", event.target.value)} required disabled={mode === "edit" && selected?.is_superuser} /><label htmlFor="user-email">ایمیل</label><input id="user-email" type="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} /><label htmlFor="user-first-name">نام</label><input id="user-first-name" value={form.first_name} onChange={(event) => updateField("first_name", event.target.value)} /><label htmlFor="user-last-name">نام خانوادگی</label><input id="user-last-name" value={form.last_name} onChange={(event) => updateField("last_name", event.target.value)} /><label htmlFor="user-role">نقش</label><select id="user-role" value={form.role} onChange={(event) => updateField("role", event.target.value)}><option value="">بدون نقش</option>{roles.map((role) => <option key={role.key} value={role.key}>{role.label}</option>)}</select></>}{(mode === "create" || mode === "password") && <><label htmlFor="user-password">گذرواژه</label><input id="user-password" type="password" autoComplete="new-password" value={form.password} onChange={(event) => updateField("password", event.target.value)} required minLength={8} /><small className="admin-help">گذرواژه پس از ارسال در این صفحه نگهداری نمی‌شود.</small></>}{formError && <p className="admin-form-error" role="alert">{formError}</p>}<div className="admin-modal-actions"><button type="button" onClick={closeForm}>انصراف</button><button className="admin-primary-button" type="submit" disabled={saving}>{saving ? "در حال ذخیره…" : "ذخیره"}</button></div></form></section></div>}
    {confirm && <div className="admin-modal-backdrop"><section className="admin-modal admin-confirm" role="dialog" aria-modal="true" aria-labelledby="confirm-title"><h2 id="confirm-title">تأیید {confirm.active ? "فعال‌سازی" : "غیرفعال‌سازی"}</h2><p>آیا از {confirm.active ? "فعال‌کردن" : "غیرفعال‌کردن"} حساب «{confirm.user.username}» مطمئن هستید؟</p><div className="admin-modal-actions"><button type="button" onClick={() => setConfirm(null)}>انصراف</button><button className="admin-primary-button" type="button" onClick={() => void confirmActivation()} disabled={saving}>تأیید</button></div></section></div>}
  </section>;
}
