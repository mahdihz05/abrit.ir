import type { Metadata } from "next";
import config from "@payload-config";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getPayload } from "payload";
import { BlockRenderer } from "@/components/block-renderer";
import { isLocale } from "@/lib/locales";
import { cms } from "@/lib/payload-cms";

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const home = await cms.home(locale);
  if (!home) return {};
  return {
    title: { absolute: home.seo.title },
    description: home.seo.description,
    alternates: { canonical: home.url, languages: Object.fromEntries(home.alternates.map((item) => [item.locale === "ar-ae" ? "ar-AE" : item.locale, item.url])) },
    robots: { index: home.seo.robots.index, follow: home.seo.robots.follow },
    openGraph: { title: home.seo.open_graph.title, description: home.seo.open_graph.description, images: home.seo.open_graph.image ? [home.seo.open_graph.image] : undefined },
  };
}

export default async function HomePage({ params, searchParams }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const query = await searchParams;
  let draft = false;
  if (query.draft === "1") {
    const payload = await getPayload({ config });
    draft = Boolean((await payload.auth({ headers: await headers() })).user);
  }
  const [home, services, packages] = await Promise.all([cms.home(locale, draft), cms.services(locale), cms.packages(locale)]);
  if (!home) notFound();
  return <main>{home.blocks.map((block) => <BlockRenderer key={block.id} block={block} locale={locale} services={services} packages={packages} />)}</main>;
}
