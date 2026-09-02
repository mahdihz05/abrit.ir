import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReferenceHomepage } from "@/components/reference-homepage";
import { isLocale, localeMeta } from "@/lib/locales";
import { extractReferenceBody, readReferenceHomepage } from "@/lib/reference-homepage";
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
  return <ReferenceHomepage body={body} direction={direction} locale={locale} />;
}
