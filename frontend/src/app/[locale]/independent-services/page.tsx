import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IndependentServicesListing } from "@/components/independent-services";
import { independentServicesListingFromCMS } from "@/lib/independent-services-cms";
import { isLocale } from "@/lib/locales";
import { cms } from "@/lib/payload-cms";
import { routeMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/independent-services">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const content = await cms.content(locale, "independent-services");
  return content ? routeMetadata(locale, "independent-services", content.title, content.excerpt) : {};
}

export default async function IndependentServicesPage({ params }: PageProps<"/[locale]/independent-services">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = await cms.content(locale, "independent-services");
  const listing = independentServicesListingFromCMS(content);
  if (!listing) notFound();
  return <IndependentServicesListing locale={locale} services={listing.services} copy={listing.copy} />;
}

