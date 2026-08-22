import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentListing } from "@/components/content-listing";
import { cms } from "@/lib/api";
import { internalCopy } from "@/lib/internal-copy";
import { isLocale } from "@/lib/locales";
import { routeMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/services">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = internalCopy[locale];
  return routeMetadata(locale, "services", copy.servicesTitle, copy.servicesIntro);
}

export default async function ServicesPage({ params }: PageProps<"/[locale]/services">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = internalCopy[locale];
  const items = await cms.services(locale);
  return <ContentListing locale={locale} eyebrow={copy.servicesEyebrow} title={copy.servicesTitle} intro={copy.servicesIntro} items={items} itemLabel={copy.service} readMore={copy.readMore} />;
}
