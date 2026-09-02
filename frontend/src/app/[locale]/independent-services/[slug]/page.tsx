import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IndependentServiceDetail } from "@/components/independent-services";
import { IndependentServiceJsonLd } from "@/components/structured-data";
import { independentServiceFromContent, independentServices, independentServicesFromContent } from "@/lib/independent-services";
import { isLocale, locales } from "@/lib/locales";
import { cms } from "@/lib/payload-cms";
import { routeMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return locales.flatMap((locale) => independentServices.map(({ slug }) => ({ locale, slug })));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/independent-services/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const content = await cms.content(locale, `independent-services/${slug}`);
  const service = independentServiceFromContent(content, slug);
  return service ? routeMetadata(locale, `independent-services/${slug}`, service.title[locale], service.heroBody[locale]) : {};
}

export default async function IndependentServicePage({ params }: PageProps<"/[locale]/independent-services/[slug]">) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const [content, listing] = await Promise.all([
    cms.content(locale, `independent-services/${slug}`),
    cms.content(locale, "independent-services"),
  ]);
  const service = independentServiceFromContent(content, slug);
  if (!service) notFound();
  return <><IndependentServiceJsonLd locale={locale} slug={service.slug} title={service.title[locale]} description={service.heroBody[locale]} /><IndependentServiceDetail locale={locale} service={service} services={independentServicesFromContent(listing)} /></>;
}

