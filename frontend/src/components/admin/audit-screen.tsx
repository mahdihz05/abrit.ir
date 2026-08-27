"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AdminApiRequestError, getAdminAudit, getAdminAuditDetail } from "@/lib/admin-api/client";
import type { AuditAction, AuditActorType, AuditDetail, AuditSummary } from "@/lib/admin-api/types";

const actions: AuditAction[] = ["auth_login_failure", "auth_login_success", "auth_logout", "publish", "restore", "retention_purge", "unpublish", "user_activate", "user_create", "user_deactivate", "user_password_reset", "user_role_change", "user_update"];
const actorTypes: AuditActorType[] = ["admin", "agent", "api", "mcp", "system"];
const pageSize = 20;
type FilterValues = { action: string; actor_type: string; actor_id: string; object_type: string; object_id: string; from: string; to: string; ordering: string; page: number };

function valuesFromParams(params: URLSearchParams): FilterValues {
  const pageValue = Number(params.get("page"));
  return { action: params.get("action") ?? "", actor_type: params.get("actor_type") ?? "", actor_id: params.get("actor_id") ?? "", object_type: params.get("object_type") ?? "", object_id: params.get("object_id") ?? "", from: params.get("from") ?? "", to: params.get("to") ?? "", ordering: params.get("ordering") === "timestamp" ? "timestamp" : "-timestamp", page: Number.isInteger(pageValue) && pageValue > 0 ? pageValue : 1 };
}

function queryFromValues(values: FilterValues) {
  const query = new URLSearchParams();
  for (const key of ["action", "actor_type", "actor_id", "object_type", "object_id", "from", "to"] as const) if (values[key]) query.set(key, values[key]);
  query.set("ordering", values.ordering === "timestamp" ? "timestamp" : "-timestamp");
  query.set("page", String(Math.max(1, values.page)));
  query.set("page_size", String(pageSize));
  return query.toString();
}

function formatDate(value: string) { const date = new Date(value); return Number.isNaN(date.valueOf()) ? value : date.toLocaleString("fa-IR", { dateStyle: "medium", timeStyle: "short" }); }
function jsonText(value: unknown) { try { return JSON.stringify(value, null, 2) ?? "null"; } catch { return "[قابل نمایش نیست]"; } }

export function AuditScreen() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const canonicalQuery = searchParams.toString();
  const urlValues = useMemo(() => valuesFromParams(new URLSearchParams(canonicalQuery)), [canonicalQuery]);
  const [draft, setDraft] = useState<{ query: string; values: FilterValues } | null>(null);
  const form = draft?.query === canonicalQuery ? draft.values : urlValues;
  const [rows, setRows] = useState<AuditSummary[]>([]);
  const [meta, setMeta] = useState({ page: 1, page_size: pageSize, total: 0, total_pages: 0 });
  const [status, setStatus] = useState<"loading" | "ready" | "denied" | "error">("loading");
  const [selected, setSelected] = useState<AuditDetail | null>(null);
  const [detailStatus, setDetailStatus] = useState<"idle" | "loading" | "error">("idle");

  useEffect(() => {
    let active = true;
    void getAdminAudit(queryFromValues(urlValues)).then((result) => { if (active) { setRows(result.data); setMeta(result.meta); setStatus("ready"); } }).catch((error: unknown) => { if (active) setStatus(error instanceof AdminApiRequestError && error.status === 403 ? "denied" : "error"); });
    return () => { active = false; };
  }, [urlValues]);

  const navigate = useCallback((values: FilterValues) => { router.replace(`${pathname}?${queryFromValues(values)}`); }, [pathname, router]);
  const update = (key: keyof FilterValues, value: string) => setDraft({ query: canonicalQuery, values: { ...form, [key]: value, ...(key !== "page" ? { page: 1 } : {}) } });
  const openDetail = async (row: AuditSummary) => { setSelected(null); setDetailStatus("loading"); try { setSelected(await getAdminAuditDetail(row.id)); setDetailStatus("idle"); } catch { setDetailStatus("error"); } };

  return <section aria-labelledby="audit-title">
    <span className="admin-eyebrow">AUDIT TRAIL</span><h1 id="audit-title">گزارش رویدادها</h1><p className="admin-intro">رویدادهای ثبت‌شده مدیریت، به‌صورت فقط‌خواندنی.</p>
    <form className="audit-filters admin-section" aria-label="فیلتر گزارش رویدادها" onSubmit={(event) => { event.preventDefault(); navigate(form); }}>
      <label>عملیات<select value={form.action} onChange={(event) => update("action", event.target.value)}><option value="">همه عملیات</option>{actions.map((action) => <option key={action} value={action}>{action}</option>)}</select></label>
      <label>نوع عامل<select value={form.actor_type} onChange={(event) => update("actor_type", event.target.value)}><option value="">همه عوامل</option>{actorTypes.map((type) => <option key={type} value={type}>{type}</option>)}</select></label>
      <label>شناسه عامل<input inputMode="numeric" value={form.actor_id} onChange={(event) => update("actor_id", event.target.value.replace(/[^0-9]/g, ""))} /></label>
      <label>نوع هدف<input value={form.object_type} onChange={(event) => update("object_type", event.target.value)} /></label>
      <label>شناسه هدف<input value={form.object_id} onChange={(event) => update("object_id", event.target.value)} /></label>
      <label>از زمان<input type="datetime-local" value={form.from} onChange={(event) => update("from", event.target.value)} /></label>
      <label>تا زمان<input type="datetime-local" value={form.to} onChange={(event) => update("to", event.target.value)} /></label>
      <label>ترتیب<select value={form.ordering} onChange={(event) => update("ordering", event.target.value)}><option value="-timestamp">جدیدترین</option><option value="timestamp">قدیمی‌ترین</option></select></label>
      <div className="audit-filter-actions"><button type="submit">اعمال فیلتر</button><button type="button" className="audit-secondary" onClick={() => navigate(valuesFromParams(new URLSearchParams()))}>پاک‌کردن</button></div>
    </form>
    {status === "loading" && <div className="admin-section admin-state" role="status"><span className="admin-state-badge">در حال بارگذاری</span><h2>در حال دریافت رویدادها</h2></div>}
    {status === "denied" && <div className="admin-section admin-state" role="alert"><span className="admin-state-badge">دسترسی محدود</span><h2>دسترسی به گزارش رویدادها ممکن نیست</h2><p>نقش فعلی شما اجازه مشاهده این بخش را ندارد.</p></div>}
    {status === "error" && <div className="admin-section admin-state" role="alert"><span className="admin-state-badge">خطا</span><h2>بارگذاری گزارش ناموفق بود</h2><p>لطفاً دوباره تلاش کنید.</p><button type="button" onClick={() => navigate(urlValues)}>تلاش دوباره</button></div>}
    {status === "ready" && <>
      {rows.length === 0 ? <div className="admin-section admin-state"><span className="admin-state-badge">بدون نتیجه</span><h2>رویدادی پیدا نشد</h2><p>فیلترها را تغییر دهید یا بعداً دوباره بررسی کنید.</p></div> : <div className="admin-section audit-table-wrap"><table><caption className="sr-only">فهرست رویدادهای مدیریت</caption><thead><tr><th scope="col">زمان</th><th scope="col">عامل</th><th scope="col">عملیات</th><th scope="col">هدف</th><th scope="col">جزئیات</th></tr></thead><tbody>{rows.map((row) => <tr key={row.id}><td>{formatDate(row.timestamp)}</td><td>{row.actor ? `${row.actor.username} (${row.actor_type})` : row.actor_type}</td><td>{row.action}</td><td>{row.object_type} / {row.object_id}</td><td><button type="button" className="audit-detail-button" onClick={() => void openDetail(row)}>مشاهده جزئیات</button></td></tr>)}</tbody></table></div>}
      <nav className="audit-pagination" aria-label="صفحات گزارش"><button type="button" disabled={meta.page <= 1} onClick={() => navigate({ ...urlValues, page: meta.page - 1 })}>قبلی</button><span aria-live="polite">صفحه {meta.page} از {Math.max(1, meta.total_pages)} · {meta.total} رویداد</span><button type="button" disabled={meta.page >= meta.total_pages} onClick={() => navigate({ ...urlValues, page: meta.page + 1 })}>بعدی</button></nav>
    </>}
    {detailStatus === "loading" && <div className="admin-section" role="status">در حال دریافت جزئیات…</div>}
    {detailStatus === "error" && <div className="admin-section" role="alert">جزئیات این رویداد دریافت نشد.</div>}
    {selected && <section className="audit-detail admin-section" aria-labelledby="audit-detail-title"><div className="audit-detail-heading"><h2 id="audit-detail-title">جزئیات رویداد</h2><button type="button" aria-label="بستن جزئیات" onClick={() => setSelected(null)}>بستن</button></div><dl><div><dt>زمان</dt><dd>{formatDate(selected.timestamp)}</dd></div><div><dt>عامل</dt><dd>{selected.actor ? `${selected.actor.username} (${selected.actor_type})` : selected.actor_type}</dd></div><div><dt>عملیات</dt><dd>{selected.action}</dd></div><div><dt>هدف</dt><dd>{selected.object_type} / {selected.object_id}</dd></div></dl><div className="audit-json-grid">{(["before", "after", "metadata"] as const).map((key) => <section key={key}><h3>{key}</h3><pre>{jsonText(selected[key])}</pre></section>)}</div></section>}
  </section>;
}
