import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentListing } from "@/components/content-listing";
import { isLocale } from "@/lib/locales";
import { localizedSolutions, pageCopy } from "@/lib/public-content";
import { routeMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/solutions">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = pageCopy[locale];
  return routeMetadata(locale, "solutions", copy.solutionsTitle, copy.solutionsIntro);
}

export default async function SolutionsPage({ params }: PageProps<"/[locale]/solutions">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = pageCopy[locale];
  return <ContentListing locale={locale} eyebrow="ABRIT · SOLUTIONS" title={copy.solutionsTitle} intro={copy.solutionsIntro} items={localizedSolutions(locale)} itemLabel={copy.solution} readMore={copy.details} />;
}
