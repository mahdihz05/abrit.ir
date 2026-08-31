import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentDetail } from "@/components/content-detail";
import { isLocale } from "@/lib/locales";
import { cms } from "@/lib/payload-cms";
import { routeMetadata } from "@/lib/seo";

const labels = {
  fa: { label: "راهکار", back: "بازگشت به راهکارها", assessment: "درخواست ارزیابی IT" }, en: { label: "Solution", back: "Back to solutions", assessment: "Request IT assessment" }, "ar-ae": { label: "الحل", back: "العودة إلى الحلول", assessment: "طلب تقييم تقنية المعلومات" },
} as const;

export async function generateMetadata({ params }: PageProps<"/[locale]/solutions/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const item = await cms.content(locale, `solutions/${slug}`);
  return item ? routeMetadata(locale, `solutions/${slug}`, item.seo.title, item.seo.description) : {};
}

export default async function SolutionPage({ params }: PageProps<"/[locale]/solutions/[slug]">) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const item = await cms.content(locale, `solutions/${slug}`);
  if (!item) notFound();
  return <ContentDetail locale={locale} content={item} label={labels[locale].label} backLabel={labels[locale].back} assessmentLabel={labels[locale].assessment} />;
}
