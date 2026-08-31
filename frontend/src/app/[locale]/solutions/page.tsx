import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentListing } from "@/components/content-listing";
import { isLocale } from "@/lib/locales";
import { cms } from "@/lib/payload-cms";
import { routeMetadata } from "@/lib/seo";

const labels = {
  fa: { item: "راهکار", more: "مشاهده جزئیات" }, en: { item: "Solution", more: "View details" }, "ar-ae": { item: "الحل", more: "عرض التفاصيل" },
} as const;

export async function generateMetadata({ params }: PageProps<"/[locale]/solutions">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const page = await cms.content(locale, "solutions");
  return page ? routeMetadata(locale, "solutions", page.seo.title, page.seo.description) : {};
}

export default async function SolutionsPage({ params }: PageProps<"/[locale]/solutions">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const [page, items] = await Promise.all([cms.content(locale, "solutions"), cms.solutions(locale)]);
  if (!page) notFound();
  return <ContentListing locale={locale} eyebrow="ABRIT · SOLUTIONS" title={page.title} intro={page.excerpt} items={items} itemLabel={labels[locale].item} readMore={labels[locale].more} />;
}
