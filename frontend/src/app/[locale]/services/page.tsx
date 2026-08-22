import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentListing } from "@/components/content-listing";
import { isLocale } from "@/lib/locales";
import { localizedServices, pageCopy } from "@/lib/public-content";
import { routeMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/services">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = pageCopy[locale];
  return routeMetadata(locale, "services", copy.servicesTitle, copy.servicesIntro);
}

export default async function ServicesPage({ params }: PageProps<"/[locale]/services">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = pageCopy[locale];
  return <ContentListing locale={locale} eyebrow="ABRIT · SERVICES" title={copy.servicesTitle} intro={copy.servicesIntro} items={localizedServices(locale)} itemLabel={copy.service} readMore={copy.details} />;
}
