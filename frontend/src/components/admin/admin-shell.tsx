"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { SessionUser } from "@/lib/admin-api/types";
import { adminNavigationRegistry, filterAdminNavigation } from "./navigation";

export type AdminShellState = "ready" | "loading" | "expired" | "denied";

export interface AdminShellProps {
  state?: AdminShellState;
  user?: SessionUser;
  children?: React.ReactNode;
  onLogout?: () => void;
}

const mockUser: SessionUser = {
  id: 1, username: "site-admin", email: "admin@example.test", first_name: "مدیر", last_name: "سایت",
  is_superuser: true, role: null, permissions: [],
};

export function AdminShell({ state = "ready", user = mockUser, children, onLogout }: AdminShellProps) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);
  const visibleItems = filterAdminNavigation(adminNavigationRegistry, user.permissions, user.is_superuser);

  useEffect(() => {
    if (!drawerOpen) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    drawerRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDrawerOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => { document.removeEventListener("keydown", onKeyDown); previouslyFocused?.focus(); };
  }, [drawerOpen]);

  const initials = `${user.first_name[0] ?? "م"}${user.last_name[0] ?? "د"}`;
  return (
    <div className="admin-shell">
      <a className="skip-link" href="#admin-main">پرش به محتوای اصلی</a>
      <aside className="admin-sidebar" aria-label="ناوبری مدیریت" data-open={drawerOpen} ref={drawerRef} tabIndex={-1}>
        <div className="admin-brand"><span className="admin-brand-mark">A</span><div><strong>AbrIT</strong><small>پنل مدیریت</small></div></div>
        <nav className="admin-nav" aria-label="فضای کاری"><span className="admin-nav-label">فضای کاری</span>{visibleItems.map((item) => (
          <Link key={item.id} href={item.href} className="admin-nav-link" data-active={pathname === item.href} onClick={() => setDrawerOpen(false)}>
            <span className="admin-nav-icon" aria-hidden="true">{item.icon}</span>{item.label}
          </Link>
        ))}</nav>
        <div className="admin-sidebar-foot">دسترسی‌ها بر اساس نقش کاربر نمایش داده می‌شوند.</div>
      </aside>
      {drawerOpen && <button className="admin-overlay" aria-label="بستن منوی مدیریت" onClick={() => setDrawerOpen(false)} />}
      <div className="admin-main">
        <header className="admin-header"><div className="admin-header-actions"><button ref={menuButtonRef} className="admin-menu-button" type="button" aria-label="باز کردن منوی مدیریت" aria-expanded={drawerOpen} onClick={() => setDrawerOpen(true)}>☰</button><span className="admin-header-title">مدیریت امن و یکپارچه</span></div><div className="admin-user"><span>{user.first_name} {user.last_name}</span>{onLogout && <button type="button" className="admin-logout" onClick={onLogout}>خروج</button>}<span className="admin-avatar" aria-hidden="true">{initials}</span></div></header>
        <main id="admin-main" className="admin-content" tabIndex={-1}>
          {state === "loading" ? <AdminState kind="loading" /> : state === "expired" ? <AdminState kind="expired" /> : state === "denied" ? <AdminState kind="denied" /> : children}
        </main>
      </div>
    </div>
  );
}

export function AdminState({ kind }: { kind: "loading" | "expired" | "denied" }) {
  const copy = { loading: ["در حال بارگذاری", "در حال آماده‌سازی پنل", "اطلاعات فضای کاری شما به‌زودی نمایش داده می‌شود."], expired: ["نشست منقضی شده", "نشست مدیریت شما منقضی شده است", "برای ادامه دوباره وارد شوید."], denied: ["دسترسی محدود", "دسترسی به این بخش ممکن نیست", "نقش فعلی شما اجازه مشاهده این بخش را ندارد."] }[kind];
  return <section className="admin-section admin-state" aria-live={kind === "loading" ? "polite" : undefined} role={kind === "loading" ? undefined : "alert"}><span className="admin-state-badge">{copy[0]}</span><h1>{copy[1]}</h1><p>{copy[2]}</p></section>;
}
