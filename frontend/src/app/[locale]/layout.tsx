import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { OrganizationJsonLd } from "@/components/structured-data";
import { ibmPlexArabic, inter, vazirmatn } from "../fonts";
import { cms } from "@/lib/api";
import { isLocale, localeMeta, locales } from "@/lib/locales";
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
  const [settings, header, footer] = await Promise.all([
    cms.settings(locale), cms.navigation("header", locale), cms.navigation("footer", locale),
  ]);
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
