import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GenericPage, getPublicPage, type PublicPageSlug } from "@/components/generic-page";
import { isLocale } from "@/lib/locales";
import { staticSettings } from "@/lib/public-content";
import { routeMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const item = getPublicPage(locale, slug);
  return item ? routeMetadata(locale, slug, item[0], item[2]) : {};
}

export default async function GenericCmsPage({ params }: PageProps<"/[locale]/[slug]">) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const item = getPublicPage(locale, slug);
  if (!item) notFound();
  return <GenericPage locale={locale} slug={slug as PublicPageSlug} settings={staticSettings(locale)} />;
}
