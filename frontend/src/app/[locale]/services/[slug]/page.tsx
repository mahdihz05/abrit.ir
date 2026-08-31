import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentDetail } from "@/components/content-detail";
import { isLocale } from "@/lib/locales";
import { cms } from "@/lib/payload-cms";
import { routeMetadata } from "@/lib/seo";

const labels = {
  fa: { label: "خدمت", back: "بازگشت به خدمات", assessment: "درخواست ارزیابی IT" }, en: { label: "Service", back: "Back to services", assessment: "Request IT assessment" }, "ar-ae": { label: "الخدمة", back: "العودة إلى الخدمات", assessment: "طلب تقييم تقنية المعلومات" },
} as const;

export async function generateMetadata({ params }: PageProps<"/[locale]/services/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const item = await cms.content(locale, `services/${slug}`);
  return item ? routeMetadata(locale, `services/${slug}`, item.seo.title, item.seo.description) : {};
}

export default async function ServicePage({ params }: PageProps<"/[locale]/services/[slug]">) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const item = await cms.content(locale, `services/${slug}`);
  if (!item) notFound();
  return <ContentDetail locale={locale} content={item} label={labels[locale].label} backLabel={labels[locale].back} assessmentLabel={labels[locale].assessment} />;
}
