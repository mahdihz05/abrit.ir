import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentDetail } from "@/components/content-detail";
import { CmsError, cms } from "@/lib/api";
import { internalCopy } from "@/lib/internal-copy";
import { isLocale } from "@/lib/locales";
import { contentMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/solutions/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  try { return contentMetadata(await cms.content(locale, `solutions/${slug}`)); }
  catch { return {}; }
}

export default async function SolutionPage({ params }: PageProps<"/[locale]/solutions/[slug]">) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  let content;
  try { content = await cms.content(locale, `solutions/${slug}`); }
  catch (error) { if (error instanceof CmsError && error.status === 404) notFound(); throw error; }
  const copy = internalCopy[locale];
  return <ContentDetail locale={locale} content={content} label={copy.solution} backLabel={copy.back} assessmentLabel={copy.assessment} />;
}
