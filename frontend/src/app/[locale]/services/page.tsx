import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentListing } from "@/components/content-listing";
import { isLocale } from "@/lib/locales";
import { cms } from "@/lib/payload-cms";
import { routeMetadata } from "@/lib/seo";

const labels = {
  fa: { item: "خدمت", more: "مشاهده جزئیات" }, en: { item: "Service", more: "View details" }, "ar-ae": { item: "الخدمة", more: "عرض التفاصيل" },
} as const;

export async function generateMetadata({ params }: PageProps<"/[locale]/services">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const page = await cms.content(locale, "services");
  return page ? routeMetadata(locale, "services", page.seo.title, page.seo.description) : {};
}

export default async function ServicesPage({ params }: PageProps<"/[locale]/services">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const [page, items] = await Promise.all([cms.content(locale, "services"), cms.services(locale)]);
  if (!page) notFound();
  return <ContentListing locale={locale} eyebrow="ABRIT · SERVICES" title={page.title} intro={page.excerpt} items={items} itemLabel={labels[locale].item} readMore={labels[locale].more} />;
}
