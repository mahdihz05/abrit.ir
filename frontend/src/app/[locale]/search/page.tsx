import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cms } from "@/lib/api";
import { isLocale } from "@/lib/locales";

export const metadata: Metadata = { title: "Search" };

const copy = {
  fa: { title: "جست‌وجو در AbrIT", placeholder: "خدمت، راهکار یا موضوع موردنظر…", button: "جست‌وجو", empty: "نتیجه‌ای پیدا نشد." },
  en: { title: "Search AbrIT", placeholder: "Search services, solutions or topics…", button: "Search", empty: "No results found." },
  "ar-ae": { title: "البحث في AbrIT", placeholder: "ابحث عن خدمة أو حل أو موضوع…", button: "بحث", empty: "لم يتم العثور على نتائج." },
} as const;

export default async function SearchPage({ params, searchParams }: PageProps<"/[locale]/search">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const values = await searchParams;
  const query = typeof values.q === "string" ? values.q.trim() : "";
  const results = query.length >= 2 ? await cms.search(locale, query) : [];
  const labels = copy[locale];
  return <main className="internal-main"><section className="internal-hero search-hero"><div className="container"><span className="internal-eyebrow">ABRIT · SEARCH</span><h1>{labels.title}</h1><form className="search-form" action={`/${locale}/search`}><input name="q" defaultValue={query} placeholder={labels.placeholder} minLength={2} required /><button className="reference-button primary">{labels.button}</button></form></div></section><section className="internal-section"><div className="container search-results">{query && results.length === 0 && <p className="search-empty">{labels.empty}</p>}{results.map((item) => <Link href={item.url} key={`${item.kind}-${item.url}`}><small>{item.kind}</small><h2>{item.title}</h2><p>{item.summary}</p></Link>)}</div></section></main>;
}
