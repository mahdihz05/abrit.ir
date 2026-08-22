"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Brand } from "./brand";
import { localeMeta, locales, ui } from "@/lib/locales";
import type { Locale, NavigationItem } from "@/lib/types";

export function SiteHeader({ locale, items }: { locale: Locale; items: NavigationItem[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const labels = ui[locale];

  function localizedPath(nextLocale: Locale) {
    const segments = pathname.split("/");
    segments[1] = nextLocale;
    return segments.join("/") || `/${nextLocale}`;
  }

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Brand locale={locale} />
        <button
          className="menu-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="site-navigation"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">{open ? labels.close : labels.menu}</span>
          <span aria-hidden="true">{open ? "×" : "☰"}</span>
        </button>
        <nav id="site-navigation" className={open ? "main-nav is-open" : "main-nav"} aria-label={labels.navigation}>
          {items.map((item) => (
            <Link key={item.id} href={item.url} target={item.open_in_new_tab ? "_blank" : undefined} onClick={() => setOpen(false)}>
              {item.title}
            </Link>
          ))}
        </nav>
        <Link className="header-search" href={`/${locale}/search`} aria-label={locale === "fa" ? "جست‌وجو" : locale === "en" ? "Search" : "بحث"}>⌕</Link>
        <div className="language-switcher" aria-label="Language">
          {locales.map((item) => (
            <Link
              key={item}
              href={localizedPath(item)}
              className={item === locale ? "is-active" : ""}
              lang={localeMeta[item].lang}
              hrefLang={localeMeta[item].lang}
              aria-label={localeMeta[item].label}
            >
              {localeMeta[item].short}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
