import Link from "next/link";
import { LeadForm } from "./lead-form";
import type { ContentDetail, Locale, SiteSettings } from "@/lib/types";

export type PublicPageSlug = "about" | "contact" | "knowledge" | "news";

export function GenericPage({ locale, slug, settings, content }: { locale: Locale; slug: PublicPageSlug; settings: SiteSettings; content: ContentDetail }) {
  const props = content.blocks[0]?.props ?? {};
  const heading = typeof props.heading === "string" ? props.heading : content.title;
  const topics = Array.isArray(props.topics) ? props.topics.filter((topic): topic is string => typeof topic === "string") : [];
  const explore = locale === "fa" ? "مشاهده خدمات" : locale === "en" ? "Explore services" : "عرض الخدمات";
  return (
    <main className="internal-main">
      <section className="internal-hero"><div className="container"><span className="internal-eyebrow">ABRIT · {slug.toUpperCase()}</span><h1>{content.title}</h1><p>{content.excerpt}</p></div></section>
      <section className="internal-section"><div className="container generic-layout"><aside><span>01</span><b>AbrIT</b></aside><article><h2>{heading}</h2><p>{content.excerpt}</p>
        {slug === "contact" ? <><div className="contact-cards"><a href={`tel:${settings.phone}`}><small>PHONE</small><b dir="ltr">{settings.phone}</b></a><div><small>LOCATION</small><b>{settings.location}</b></div></div><LeadForm locale={locale} context="contact-page" /></> : <><div className="topic-grid">{topics.map((topic, index) => <div key={topic}><span>{String(index + 1).padStart(2, "0")}</span><h3>{topic}</h3></div>)}</div><Link className="reference-button primary" href={`/${locale}/services`}>{explore}</Link></>}
      </article></div></section>
    </main>
  );
}
