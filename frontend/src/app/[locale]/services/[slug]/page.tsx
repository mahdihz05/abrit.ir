import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicDetail } from "@/components/public-detail";
import { isLocale, locales } from "@/lib/locales";
import { getService, services } from "@/lib/public-content";
import { routeMetadata } from "@/lib/seo";

export function generateStaticParams() { return locales.flatMap((locale) => services.map(({ slug }) => ({ locale, slug }))); }

export async function generateMetadata({ params }: PageProps<"/[locale]/services/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const item = getService(slug);
  return item ? routeMetadata(locale, `services/${slug}`, item.title[locale], item.excerpt[locale]) : {};
}

export default async function ServicePage({ params }: PageProps<"/[locale]/services/[slug]">) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const item = getService(slug);
  if (!item) notFound();
  return <PublicDetail locale={locale} item={item} kind="service" />;
}
