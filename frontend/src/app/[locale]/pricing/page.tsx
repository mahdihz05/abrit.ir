import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PricingConfigurator } from "@/components/pricing-configurator";
import { PricingOverview } from "@/components/pricing-overview";
import { LeadForm } from "@/components/lead-form";
import { internalCopy } from "@/lib/internal-copy";
import { isLocale } from "@/lib/locales";
import { localizedPackages } from "@/lib/public-content";
import { routeMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/pricing">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = internalCopy[locale];
  return routeMetadata(locale, "pricing", copy.pricingTitle, copy.pricingIntro);
}

export default async function PricingPage({ params, searchParams }: PageProps<"/[locale]/pricing">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const query = await searchParams;
  const initialPackage = typeof query.package === "string" ? query.package : undefined;
  const packages = localizedPackages(locale);
  const copy = internalCopy[locale];
  return <main className="internal-main pricing-page"><section className="internal-hero"><div className="container"><span className="internal-eyebrow">{copy.pricingEyebrow}</span><h1>{copy.pricingTitle}</h1><p>{copy.pricingIntro}</p></div></section><section className="internal-section calculator-section" id="calculator"><div className="container"><PricingConfigurator locale={locale} initialPackage={initialPackage} /></div></section><section className="lead-section pricing-lead-section"><div className="container"><LeadForm locale={locale} kind="quote-request" defaultPackage={initialPackage} compact /></div></section><section className="internal-section pricing-workspace"><div className="container"><PricingOverview locale={locale} packages={packages} /></div></section></main>;
}
