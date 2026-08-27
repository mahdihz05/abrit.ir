"use client";

import { useEffect, useState } from "react";
import { getAdminDashboard } from "@/lib/admin-api/client";
import type { DashboardData } from "@/lib/admin-api/types";

type DashboardStatus = "loading" | "ready" | "empty" | "denied" | "expired" | "error";

function hasApiStatus(error: unknown, status: number): boolean {
  return typeof error === "object" && error !== null && "status" in error
    && (error as { status?: unknown }).status === status;
}

function isEmptyDashboard(data: DashboardData) {
  return data.users.total === 0 && data.users.active === 0 && data.users.locked === 0
    && data.content.draft === 0 && data.content.review === 0 && data.content.scheduled === 0
    && data.content.published === 0 && data.content.archived === 0
    && data.submissions.new === 0 && data.revalidation.pending === 0 && data.revalidation.failed === 0;
}

function StateMessage({ status, onRetry }: { status: Exclude<DashboardStatus, "ready" | "loading">; onRetry?: () => void }) {
  const copy = {
    denied: ["دسترسی محدود", "دسترسی به داده‌های داشبورد ممکن نیست.", "نقش فعلی شما اجازه مشاهده این اطلاعات را ندارد."],
    expired: ["نشست منقضی شده", "نشست مدیریت شما منقضی شده است.", "برای ادامه دوباره وارد شوید."],
    empty: ["داشبورد خالی است", "هنوز داده‌ای برای نمایش وجود ندارد.", "با ایجاد داده‌های مدیریتی، خلاصه آن‌ها در اینجا نمایش داده می‌شود."],
    error: ["خطا در دریافت اطلاعات", "اطلاعات داشبورد بارگذاری نشد.", "دوباره تلاش کنید یا با پشتیبانی تماس بگیرید."],
  }[status];
  return <section className="admin-section admin-state" role="alert" aria-live="polite">
    <span className="admin-state-badge">{copy[0]}</span>
    <h2>{copy[1]}</h2>
    <p>{copy[2]}</p>
    {onRetry && <button type="button" className="admin-state-action" onClick={onRetry}>تلاش دوباره</button>}
  </section>;
}

function DashboardCards({ data }: { data: DashboardData }) {
  return <div className="admin-dashboard-cards">
    <article className="admin-dashboard-card">
      <div className="admin-dashboard-card-heading"><span className="admin-card-icon" aria-hidden="true">کار</span><h2>کاربران</h2></div>
      <p>مجموع کاربران ثبت‌شده</p><strong>{data.users.total}</strong>
      <dl><div><dt>فعال</dt><dd>{data.users.active}</dd></div><div><dt>قفل‌شده</dt><dd>{data.users.locked}</dd></div></dl>
    </article>
    <article className="admin-dashboard-card">
      <div className="admin-dashboard-card-heading"><span className="admin-card-icon" aria-hidden="true">محتوا</span><h2>محتوا</h2></div>
      <p>تعداد موارد در هر وضعیت</p>
      <dl className="admin-metric-list"><div><dt>پیش‌نویس</dt><dd>{data.content.draft}</dd></div><div><dt>در بررسی</dt><dd>{data.content.review}</dd></div><div><dt>زمان‌بندی‌شده</dt><dd>{data.content.scheduled}</dd></div><div><dt>منتشرشده</dt><dd>{data.content.published}</dd></div><div><dt>بایگانی‌شده</dt><dd>{data.content.archived}</dd></div></dl>
    </article>
    <article className="admin-dashboard-card">
      <div className="admin-dashboard-card-heading"><span className="admin-card-icon" aria-hidden="true">ارسال</span><h2>ارسال‌ها</h2></div>
      <p>موارد جدید برای بررسی</p><strong>{data.submissions.new}</strong>
      <span className="admin-card-status">{data.submissions.new === 0 ? "ارسال جدیدی وجود ندارد" : "نیازمند بررسی"}</span>
    </article>
    <article className="admin-dashboard-card">
      <div className="admin-dashboard-card-heading"><span className="admin-card-icon" aria-hidden="true">شبکه</span><h2>اعتبارسنجی مجدد</h2></div>
      <p>وضعیت صف به‌روزرسانی</p>
      <dl><div><dt>در انتظار</dt><dd>{data.revalidation.pending}</dd></div><div><dt>ناموفق</dt><dd>{data.revalidation.failed}</dd></div></dl>
      <span className="admin-card-status">{data.revalidation.failed === 0 ? "خطای ثبت‌شده‌ای نیست" : "نیازمند پیگیری"}</span>
    </article>
  </div>;
}

export function AdminDashboard() {
  const [status, setStatus] = useState<DashboardStatus>("loading");
  const [data, setData] = useState<DashboardData | null>(null);

  async function loadDashboard() {
    setStatus("loading");
    try {
      const result = await getAdminDashboard();
      setData(result);
      setStatus(isEmptyDashboard(result) ? "empty" : "ready");
    } catch (error) {
      if (hasApiStatus(error, 403)) setStatus("denied");
      else if (hasApiStatus(error, 401)) setStatus("expired");
      else setStatus("error");
    }
  }

  useEffect(() => {
    void loadDashboard();
    // The dashboard is intentionally loaded once; live updates are out of scope.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <section aria-labelledby="dashboard-title">
    <span className="admin-eyebrow">ADMIN WORKSPACE</span>
    <h1 id="dashboard-title">داشبورد مدیریت</h1>
    <p className="admin-intro">نمایی سریع از وضعیت کاربران، محتوا، ارسال‌ها و اعتبارسنجی مجدد.</p>
    {status === "loading" && <section className="admin-section admin-state" aria-live="polite"><span className="admin-state-badge">در حال بارگذاری</span><h2>در حال آماده‌سازی داشبورد</h2><p>اطلاعات فضای کاری شما به‌زودی نمایش داده می‌شود.</p></section>}
    {status === "ready" && data && <><DashboardCards data={data} /><p className="admin-generated-at">آخرین به‌روزرسانی: <time dateTime={data.generated_at}>{data.generated_at}</time></p></>}
    {status !== "loading" && status !== "ready" && <StateMessage status={status} onRetry={status === "error" ? () => void loadDashboard() : undefined} />}
  </section>;
}
