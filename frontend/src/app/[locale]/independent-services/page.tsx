import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IndependentServicesListing } from "@/components/independent-services";
import { independentPageCopy, independentServicesFromContent } from "@/lib/independent-services";
import { isLocale } from "@/lib/locales";
import { cms } from "@/lib/payload-cms";
import { routeMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/independent-services">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return routeMetadata(locale, "independent-services", independentPageCopy.title[locale], independentPageCopy.intro[locale]);
}

export default async function IndependentServicesPage({ params }: PageProps<"/[locale]/independent-services">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = await cms.content(locale, "independent-services");
  if (!content) notFound();
  return <IndependentServicesListing locale={locale} services={independentServicesFromContent(content)} />;
}

