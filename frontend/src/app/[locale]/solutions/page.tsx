import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentListing } from "@/components/content-listing";
import { cms } from "@/lib/api";
import { internalCopy } from "@/lib/internal-copy";
import { isLocale } from "@/lib/locales";
import { routeMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/solutions">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = internalCopy[locale];
  return routeMetadata(locale, "solutions", copy.solutionsTitle, copy.solutionsIntro);
}

export default async function SolutionsPage({ params }: PageProps<"/[locale]/solutions">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = internalCopy[locale];
  const items = await cms.solutions(locale);
  return <ContentListing locale={locale} eyebrow={copy.solutionsEyebrow} title={copy.solutionsTitle} intro={copy.solutionsIntro} items={items} itemLabel={copy.solution} readMore={copy.readMore} />;
}
