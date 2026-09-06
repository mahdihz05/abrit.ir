import styles from "./reference-homepage.module.css";
import { HomepageRuntime } from "./homepage-runtime";
import { HomepageNetworkPatterns } from "./homepage-network-patterns";
import { HomepageLeadMount } from "./homepage-lead-mount";
import { HomepageCmsHero } from "./homepage-cms-hero";
import { HOMEPAGE_RUNTIME_URL, HOMEPAGE_STYLESHEET_URL } from "@/lib/homepage-assets";
import type { Locale } from "@/lib/types";

const icons = [
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/><path d="m8 10 2.2 2.2L16 7"/></svg>',
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 7h7l2 2h9v10H3z"/><path d="M8 14h8M12 11v6"/></svg>',
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="5" r="2"/><circle cx="5" cy="18" r="2"/><circle cx="19" cy="18" r="2"/><path d="M12 7v5M12 12 6 17M12 12l6 5"/><path d="M9 12h6"/></svg>',
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="9" cy="8" r="3"/><path d="M3 20c0-4 2.7-7 6-7 2.1 0 3.9 1.2 5 3"/><rect x="14" y="12" width="7" height="7" rx="2"/><path d="M16 12V10a1.5 1.5 0 0 1 3 0v2"/></svg>',
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3 1.1 0 2.1-.1 3-.3"/><path d="m16 18 2 2 4-5"/></svg>',
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 12h4l2-6 4 12 2-6h6"/><path d="M3 20h18"/></svg>',
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M17.5 14v7M14 17.5h7"/></svg>',
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 4h4l2 5-3 2c1.5 3 3 4.5 6 6l2-3 5 2v4c0 1-1 2-2 2C10 22 2 14 2 5c0-1 1-1 3-1Z"/><path d="M15 4c2 1 4 3 5 5"/></svg>',
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="12" rx="2"/><path d="M8 21h8M12 17v4"/><path d="m8 11 2-2 2 2 4-4"/></svg>',
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M7 7h5V3l5 5-5 5V9H7a3 3 0 0 0-3 3"/><path d="M17 17h-5v4l-5-5 5-5v4h5a3 3 0 0 0 3-3"/></svg>',
];

const escapeHTML = (value: string) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

function cmsBody(body: string, services: import("@/lib/types").ContentSummary[] = [], solutions: import("@/lib/types").ContentSummary[] = []) {
  const action = { fa: "مشاهده خدمت", en: "Explore service", "ar-ae": "استعراض الخدمة" } as const;
  const locale = services[0]?.locale ?? solutions[0]?.locale ?? "fa";
  const serviceCards = services.map((service, index) => `<article class="service ${index < 2 ? "service-large" : ""} reveal" data-cms-owned="true"><div class="service-top"><div class="ico">${icons[index] ?? icons[0]}</div><span class="service-index">${String(index + 1).padStart(2, "0")}</span></div><div class="service-content"><h3>${escapeHTML(service.title)}</h3><p>${escapeHTML(service.excerpt)}</p></div><a href="${escapeHTML(service.url)}"><span>${action[locale]}</span><b aria-hidden="true">↗</b></a></article>`).join("");
  const solutionNodes = solutions.map((solution, index) => `<a class="node n${index + 1}" href="${escapeHTML(solution.url)}" data-cms-owned="true"><span>0${index + 1}</span><h3>${escapeHTML(solution.title)}</h3><p>${escapeHTML(solution.excerpt)}</p></a>`).join("");
  return body
    .replace('<header class="hero-shell"', '<header class="hero-shell" data-abrit-react-owned="hero"')
    .replace('<div class="servicegrid" id="servicegrid"></div>', `<div class="servicegrid" id="servicegrid" data-abrit-react-owned="services">${serviceCards}</div>`)
    .replace('<div id="nodes"></div>', `<div id="nodes" data-abrit-react-owned="solutions">${solutionNodes}</div>`);
}

export function ReferenceHomepage({ body, direction, locale, heroes, services, solutions }: { body: string; direction: "rtl" | "ltr"; locale: Locale; heroes: Parameters<typeof HomepageCmsHero>[0]["content"]; services?: import("@/lib/types").ContentSummary[]; solutions?: import("@/lib/types").ContentSummary[] }) {
  const renderedBody = cmsBody(body, services, solutions);
  return (
    <>
      <link rel="stylesheet" href={HOMEPAGE_STYLESHEET_URL} />
      <span id="meta" hidden />
      <div
        className={`reference-homepage ${styles.homepage}`}
        data-homepage-locale={locale}
        dir={direction}
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: renderedBody }}
      />
      <script src={HOMEPAGE_RUNTIME_URL} defer data-abrit-homepage-runtime="true" />
      <HomepageRuntime />
      <HomepageNetworkPatterns />
      {heroes.length ? <HomepageCmsHero content={heroes} /> : null}
      <HomepageLeadMount locale={locale} />
    </>
  );
}
