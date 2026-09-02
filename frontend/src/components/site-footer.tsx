"use client";

import Link from "next/link";
import { Brand } from "./brand";
import {
  independentPageCopy,
  independentServices,
} from "@/lib/independent-services";
import { ui } from "@/lib/locales";
import type { Locale, NavigationItem, SiteSettings } from "@/lib/types";

export function SiteFooter({
  locale,
  items,
  settings,
}: {
  locale: Locale;
  items: NavigationItem[];
  settings: SiteSettings;
}) {
  const year = new Intl.NumberFormat(locale, { useGrouping: false }).format(
    new Date().getFullYear(),
  );
  const brandName = locale === "fa" ? "ابریت" : "AbrIT";

  return (
    <footer className="site-footer" id="contact">
      <div className="container footer-grid">
        <div className="footer-intro">
          <Brand locale={locale} inverse />
          <p>{settings.seo.description}</p>
        </div>
        <nav className="footer-nav" aria-label={ui[locale].navigation}>
          {items.map((item) => (
            <Link key={item.id} href={item.url}>
              {item.title}
            </Link>
          ))}
        </nav>
        <nav
          className="footer-independent-nav"
          aria-label={independentPageCopy.title[locale]}
        >
          <a
            className="footer-nav-heading"
            href={`/${locale}/independent-services`}
          >
            {independentPageCopy.title[locale]}
          </a>
          {independentServices.map((service) => (
            <a
              key={service.slug}
              href={`/${locale}/independent-services/${service.slug}`}
            >
              {service.title[locale]}
            </a>
          ))}
        </nav>
        <div className="footer-contact">
          {settings.phone && (
            <a dir="ltr" href={`tel:${settings.phone}`}>
              {settings.phone}
            </a>
          )}
          {settings.email && (
            <a href={`mailto:${settings.email}`}>{settings.email}</a>
          )}
          <span>{settings.location}</span>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>
          © {year} {brandName}. {ui[locale].rights}
        </span>
      </div>
    </footer>
  );
}
