import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { OrganizationJsonLd } from "@/components/structured-data";
import { ibmPlexArabic, inter, vazirmatn } from "../fonts";
import { isLocale, localeMeta, locales } from "@/lib/locales";
import { staticNavigation, staticSettings } from "@/lib/public-content";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://abrit.ir"),
  title: { default: "AbrIT", template: "%s | AbrIT" },
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function InternalLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const settings = staticSettings(locale);
  const header = staticNavigation(locale);
  const footer = staticNavigation(locale);
  const meta = localeMeta[locale];
  return (
    <html lang={meta.lang} dir={meta.dir} className={`${vazirmatn.variable} ${inter.variable} ${ibmPlexArabic.variable}`}>
      <body className="internal-body">
        <OrganizationJsonLd settings={settings} />
        <SiteHeader locale={locale} items={header} />
        {children}
        <SiteFooter locale={locale} items={footer} settings={settings} />
      </body>
    </html>
  );
}
