import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlockRenderer } from "@/components/block-renderer";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { cms } from "@/lib/api";
import { isLocale, localeMeta, locales, ui } from "@/lib/locales";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  try {
    const home = await cms.home(locale);
    return {
      title: home.seo.title,
      description: home.seo.description,
      robots: { index: home.seo.robots.index, follow: home.seo.robots.follow },
      alternates: { languages: Object.fromEntries(locales.map((item) => [localeMeta[item].lang, `/${item}`])) },
      openGraph: { title: home.seo.title, description: home.seo.description, locale: localeMeta[locale].lang },
    };
  } catch {
    return { title: "AbrIT" };
  }
}

async function loadHome(locale: "fa" | "en" | "ar-ae") {
  try {
    return await Promise.all([
      cms.settings(locale), cms.navigation("header", locale), cms.navigation("footer", locale),
      cms.home(locale), cms.services(locale), cms.packages(locale),
    ]);
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const data = await loadHome(locale);
  if (!data) {
    return <main className="error-state"><h1>AbrIT</h1><p>{ui[locale].unavailable}</p></main>;
  }
  const [settings, header, footer, home, services, packages] = data;
  return (
    <>
      <a className="skip-link" href="#main-content">{ui[locale].skip}</a>
      <SiteHeader locale={locale} items={header} />
      <main id="main-content">
        {home.blocks.sort((a, b) => a.order - b.order).map((block) => (
          <BlockRenderer key={block.id} block={block} locale={locale} services={services} packages={packages} />
        ))}
      </main>
      <SiteFooter locale={locale} items={footer} settings={settings} />
    </>
  );
}
