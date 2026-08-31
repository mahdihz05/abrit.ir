import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IndependentServiceDetail } from "@/components/independent-services";
import { IndependentServiceJsonLd } from "@/components/structured-data";
import { getIndependentService, independentServices } from "@/lib/independent-services";
import { isLocale, locales } from "@/lib/locales";
import { routeMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return locales.flatMap((locale) => independentServices.map(({ slug }) => ({ locale, slug })));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/independent-services/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const service = getIndependentService(slug);
  return service ? routeMetadata(locale, `independent-services/${slug}`, service.title[locale], service.heroBody[locale]) : {};
}

export default async function IndependentServicePage({ params }: PageProps<"/[locale]/independent-services/[slug]">) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const service = getIndependentService(slug);
  if (!service) notFound();
  return <><IndependentServiceJsonLd locale={locale} slug={service.slug} title={service.title[locale]} description={service.heroBody[locale]} /><IndependentServiceDetail locale={locale} service={service} /></>;
}

