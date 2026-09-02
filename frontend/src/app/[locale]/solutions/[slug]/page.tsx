import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicDetail } from "@/components/public-detail";
import { isLocale, locales } from "@/lib/locales";
import { getSolution, solutions } from "@/lib/public-content";
import { routeMetadata } from "@/lib/seo";

export function generateStaticParams() { return locales.flatMap((locale) => solutions.map(({ slug }) => ({ locale, slug }))); }

export async function generateMetadata({ params }: PageProps<"/[locale]/solutions/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const item = getSolution(slug);
  return item ? routeMetadata(locale, `solutions/${slug}`, item.title[locale], item.excerpt[locale]) : {};
}

export default async function SolutionPage({ params }: PageProps<"/[locale]/solutions/[slug]">) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const item = getSolution(slug);
  if (!item) notFound();
  return <PublicDetail locale={locale} item={item} kind="solution" />;
}
