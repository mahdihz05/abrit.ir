import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GenericPage } from "@/components/generic-page";
import { CmsError, cms } from "@/lib/api";
import { isLocale } from "@/lib/locales";
import { contentMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  try { return contentMetadata(await cms.content(locale, slug)); }
  catch { return {}; }
}

export default async function GenericCmsPage({ params }: PageProps<"/[locale]/[slug]">) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  let content;
  try { content = await cms.content(locale, slug); }
  catch (error) { if (error instanceof CmsError && error.status === 404) notFound(); throw error; }
  const settings = await cms.settings(locale);
  return <GenericPage locale={locale} content={content} settings={settings} />;
}
