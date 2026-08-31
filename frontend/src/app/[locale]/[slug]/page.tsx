import type { Metadata } from "next";
import config from "@payload-config";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getPayload } from "payload";
import { GenericPage, type PublicPageSlug } from "@/components/generic-page";
import { BlockRenderer } from "@/components/block-renderer";
import { isLocale } from "@/lib/locales";
import { cms } from "@/lib/payload-cms";
import { routeMetadata } from "@/lib/seo";

const publicPages = new Set<PublicPageSlug>(["about", "contact", "knowledge", "news"]);

export async function generateMetadata({ params }: PageProps<"/[locale]/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const content = await cms.content(locale, slug);
  if (!content) return {};
  if (publicPages.has(slug as PublicPageSlug)) return routeMetadata(locale, slug, content.seo.title, content.seo.description);
  return {
    title: { absolute: content.seo.title },
    description: content.seo.description,
    alternates: { canonical: content.seo.canonical_url || content.url },
    robots: { index: content.seo.robots.index, follow: content.seo.robots.follow },
  };
}

export default async function GenericCmsPage({ params, searchParams }: PageProps<"/[locale]/[slug]">) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const query = await searchParams;
  let draft = false;
  if (query.draft === "1") {
    const payload = await getPayload({ config });
    draft = Boolean((await payload.auth({ headers: await headers() })).user);
  }
  const [content, settings, services, packages] = await Promise.all([cms.content(locale, slug, draft), cms.settings(locale), cms.services(locale), cms.packages(locale)]);
  if (!content) notFound();
  if (publicPages.has(slug as PublicPageSlug)) return <GenericPage locale={locale} slug={slug as PublicPageSlug} settings={settings} content={content} />;
  return <main>{content.blocks.map((block) => <BlockRenderer key={block.id} block={block} locale={locale} services={services} packages={packages} />)}</main>;
}
