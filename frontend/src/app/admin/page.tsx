"use client";

import { AdminShell } from "@/components/admin/admin-shell";
import { useAdminAuth } from "@/lib/admin-api/auth-context";

export default function AdminPage() {
  const { user, logout } = useAdminAuth();
  if (!user) return null;
  return <AdminShell user={user} onLogout={() => void logout()}><section><span className="admin-eyebrow">ADMIN WORKSPACE</span><h1>خوش آمدید، {user.first_name || user.username}</h1><p className="admin-intro">یک نمای سریع از وضعیت فضای کاری و دسترسی‌های مدیریت.</p><div className="admin-card-grid"><article className="admin-card"><small>محتوای منتشرشده</small><strong>۱۲۸</strong></article><article className="admin-card"><small>ارسال‌های در انتظار بررسی</small><strong>۰۷</strong></article><article className="admin-card"><small>رویدادهای امروز</small><strong>۲۴</strong></article></div><section className="admin-section"><h2>فضای مدیریت آماده است</h2><p>داده‌های این صفحه از نشست معتبر مدیریت استفاده می‌کنند.</p></section></section></AdminShell>;
}
