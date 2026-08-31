import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GenericPage, type PublicPageSlug } from "@/components/generic-page";
import { isLocale } from "@/lib/locales";
import { cms } from "@/lib/payload-cms";
import { routeMetadata } from "@/lib/seo";

const publicPages = new Set<PublicPageSlug>(["about", "contact", "knowledge", "news"]);

export async function generateMetadata({ params }: PageProps<"/[locale]/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale) || !publicPages.has(slug as PublicPageSlug)) return {};
  const content = await cms.content(locale, slug);
  return content ? routeMetadata(locale, slug, content.seo.title, content.seo.description) : {};
}

export default async function GenericCmsPage({ params }: PageProps<"/[locale]/[slug]">) {
  const { locale, slug } = await params;
  if (!isLocale(locale) || !publicPages.has(slug as PublicPageSlug)) notFound();
  const [content, settings] = await Promise.all([cms.content(locale, slug), cms.settings(locale)]);
  if (!content) notFound();
  return <GenericPage locale={locale} slug={slug as PublicPageSlug} settings={settings} content={content} />;
}
