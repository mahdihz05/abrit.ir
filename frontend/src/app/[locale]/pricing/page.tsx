import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PricingConfigurator } from "@/components/pricing-configurator";
import { cms } from "@/lib/api";
import { internalCopy } from "@/lib/internal-copy";
import { isLocale } from "@/lib/locales";

export const metadata: Metadata = { title: "Managed IT Pricing" };

export default async function PricingPage({ params, searchParams }: PageProps<"/[locale]/pricing">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const query = await searchParams;
  const initialPackage = typeof query.package === "string" ? query.package : undefined;
  const packages = await cms.packages(locale);
  const copy = internalCopy[locale];
  return <main className="internal-main"><section className="internal-hero"><div className="container"><span className="internal-eyebrow">{copy.pricingEyebrow}</span><h1>{copy.pricingTitle}</h1><p>{copy.pricingIntro}</p></div></section><section className="internal-section pricing-workspace"><div className="container"><PricingConfigurator locale={locale} packages={packages} initialPackage={initialPackage} /></div></section></main>;
}
