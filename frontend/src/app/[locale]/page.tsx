import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReferenceHomepage } from "@/components/reference-homepage";
import { isLocale, localeMeta } from "@/lib/locales";
import { extractReferenceBody, readReferenceHomepage } from "@/lib/reference-homepage";
import { cms } from "@/lib/payload-cms";
import type { Locale } from "@/lib/types";

const seo: Record<Locale, { title: string; description: string }> = {
  fa: {
    title: "Abrit | مدیریت یکپارچه فناوری اطلاعات",
    description: "ابریت؛ خدمات مدیریت‌شده فناوری اطلاعات، امنیت، شبکه، بکاپ، مانیتورینگ، فضای کار سازمانی و اتوماسیون.",
  },
  en: {
    title: "Abrit | Managed IT & IT as a Service",
    description: "Managed IT, security, networking, backup, monitoring, digital workplace and automation services from Abrit.",
  },
  "ar-ae": {
    title: "Abrit | خدمات تقنية المعلومات المُدارة",
    description: "خدمات تقنية المعلومات المُدارة والأمن والشبكات والنسخ الاحتياطي والمراقبة والأتمتة من Abrit.",
  },
};

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const content = seo[locale];
  return {
    title: { absolute: content.title },
    description: content.description,
    alternates: {
      canonical: `/${locale}`,
      languages: { fa: "/fa", en: "/en", "ar-AE": "/ar-ae", "x-default": "/fa" },
    },
  };
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const body = extractReferenceBody(await readReferenceHomepage());
  const direction = localeMeta[locale].dir;
  const home = await cms.home(locale);
  const heroes = (home?.blocks ?? []).flatMap((block) => {
    const hero = block.props;
    return block.type === "hero" && typeof hero.eyebrow === "string" && typeof hero.title === "string" && typeof hero.highlight === "string" && typeof hero.body === "string" && Array.isArray(hero.points)
      ? [{ eyebrow: hero.eyebrow, title: hero.title, highlight: hero.highlight, body: hero.body, primaryCTA: hero.primary_cta as { label?: string; url?: string; openInNewTab?: boolean } | undefined, secondaryCTA: hero.secondary_cta as { label?: string; url?: string; openInNewTab?: boolean } | undefined, points: hero.points.filter((point): point is string => typeof point === "string") }]
      : [];
  });
  return <ReferenceHomepage body={body} direction={direction} locale={locale} heroes={heroes} services={home?.homepageServices} solutions={home?.homepageSolutions} />;
}
