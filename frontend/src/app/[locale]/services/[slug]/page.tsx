import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentDetail } from "@/components/content-detail";
import { CmsError, cms } from "@/lib/api";
import { internalCopy } from "@/lib/internal-copy";
import { isLocale } from "@/lib/locales";

export async function generateMetadata({ params }: PageProps<"/[locale]/services/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  try { const content = await cms.content(locale, `services/${slug}`); return { title: content.seo.title, description: content.seo.description }; }
  catch { return {}; }
}

export default async function ServicePage({ params }: PageProps<"/[locale]/services/[slug]">) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  let content;
  try { content = await cms.content(locale, `services/${slug}`); }
  catch (error) { if (error instanceof CmsError && error.status === 404) notFound(); throw error; }
  const copy = internalCopy[locale];
  return <ContentDetail locale={locale} content={content} label={copy.service} backLabel={copy.back} assessmentLabel={copy.assessment} />;
}
