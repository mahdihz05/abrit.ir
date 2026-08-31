import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PricingConfigurator } from "@/components/pricing-configurator";
import { PricingOverview } from "@/components/pricing-overview";
import { LeadForm } from "@/components/lead-form";
import { isLocale } from "@/lib/locales";
import { cms } from "@/lib/payload-cms";
import { routeMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/pricing">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const content = await cms.content(locale, "pricing");
  if (!content) return {};
  return routeMetadata(locale, "pricing", content.seo.title, content.seo.description);
}

export default async function PricingPage({ params, searchParams }: PageProps<"/[locale]/pricing">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const query = await searchParams;
  const initialPackage = typeof query.package === "string" ? query.package : undefined;
  const [packages, managedPackages, content] = await Promise.all([cms.packages(locale), cms.managedPackages(locale), cms.content(locale, "pricing")]);
  if (!content) notFound();
  const eyebrow = String(content.blocks[0]?.props.eyebrow ?? "");
  return <main className="internal-main pricing-page"><section className="internal-hero"><div className="container"><span className="internal-eyebrow">{eyebrow}</span><h1>{content.title}</h1><p>{content.excerpt}</p></div></section><section className="internal-section calculator-section" id="calculator"><div className="container"><PricingConfigurator locale={locale} initialPackage={initialPackage} packages={managedPackages} /></div></section><section className="lead-section pricing-lead-section"><div className="container"><LeadForm locale={locale} kind="quote-request" defaultPackage={initialPackage} compact /></div></section><section className="internal-section pricing-workspace"><div className="container"><PricingOverview locale={locale} packages={packages} /></div></section></main>;
}
