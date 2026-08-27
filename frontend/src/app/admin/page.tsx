import { AdminShell } from "@/components/admin/admin-shell";

export default function AdminPage() {
  return <AdminShell><section><span className="admin-eyebrow">ADMIN WORKSPACE</span><h1>خوش آمدید، مدیر سایت</h1><p className="admin-intro">یک نمای سریع از وضعیت فضای کاری و دسترسی‌های مدیریت.</p><div className="admin-card-grid"><article className="admin-card"><small>محتوای منتشرشده</small><strong>۱۲۸</strong></article><article className="admin-card"><small>ارسال‌های در انتظار بررسی</small><strong>۰۷</strong></article><article className="admin-card"><small>رویدادهای امروز</small><strong>۲۴</strong></article></div><section className="admin-section"><h2>فضای مدیریت آماده است</h2><p>این پوسته با داده‌های آزمایشی ساخته شده و به نشست واقعی یا API متصل نیست.</p></section></section></AdminShell>;
}
