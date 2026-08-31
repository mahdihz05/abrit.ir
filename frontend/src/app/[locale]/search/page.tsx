import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { localizedIndependentServices } from "@/lib/independent-services";
import { isLocale } from "@/lib/locales";
import { localizedServices, localizedSolutions } from "@/lib/public-content";
import { routeMetadata } from "@/lib/seo";

const copy = {
  fa: { title: "جست‌وجو در AbrIT", placeholder: "خدمت، راهکار یا موضوع موردنظر…", button: "جست‌وجو", empty: "نتیجه‌ای پیدا نشد." },
  en: { title: "Search AbrIT", placeholder: "Search services, solutions or topics…", button: "Search", empty: "No results found." },
  "ar-ae": { title: "البحث في AbrIT", placeholder: "ابحث عن خدمة أو حل أو موضوع…", button: "بحث", empty: "لم يتم العثور على نتائج." },
} as const;

export async function generateMetadata({ params }: PageProps<"/[locale]/search">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return routeMetadata(locale, "search", copy[locale].title, copy[locale].placeholder);
}

export default async function SearchPage({ params, searchParams }: PageProps<"/[locale]/search">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const values = await searchParams;
  const query = typeof values.q === "string" ? values.q.trim() : "";
  const haystack = [...localizedServices(locale), ...localizedSolutions(locale), ...localizedIndependentServices(locale)];
  const normalized = query.toLocaleLowerCase(locale);
  const results = query.length >= 2 ? haystack.filter((item) => `${item.title} ${item.excerpt}`.toLocaleLowerCase(locale).includes(normalized)).map((item) => ({ kind: item.kind, title: item.title, summary: item.excerpt, url: item.url })) : [];
  const labels = copy[locale];
  return <main className="internal-main"><section className="internal-hero search-hero"><div className="container"><span className="internal-eyebrow">ABRIT · SEARCH</span><h1>{labels.title}</h1><form className="search-form" action={`/${locale}/search`}><input name="q" defaultValue={query} placeholder={labels.placeholder} minLength={2} required /><button className="reference-button primary">{labels.button}</button></form></div></section><section className="internal-section"><div className="container search-results">{query && results.length === 0 && <p className="search-empty">{labels.empty}</p>}{results.map((item) => <Link href={item.url} key={`${item.kind}-${item.url}`}><small>{item.kind}</small><h2>{item.title}</h2><p>{item.summary}</p></Link>)}</div></section></main>;
}
