import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import Script from "next/script";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { AmbientMotion } from "@/components/ambient-motion";
import { OrganizationJsonLd } from "@/components/structured-data";
import { ibmPlexArabic, inter, vazirmatn } from "../fonts";
import { isLocale, localeMeta, locales } from "@/lib/locales";
import { cms } from "@/lib/payload-cms";
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
  const [settings, header, footer, design] = await Promise.all([
    cms.settings(locale),
    cms.navigation("header", locale),
    cms.navigation("footer", locale),
    cms.designSettings(),
  ]);
  const meta = localeMeta[locale];
  return (
    <html lang={meta.lang} dir={meta.dir} className={`${vazirmatn.variable} ${inter.variable} ${ibmPlexArabic.variable}`}>
      <body className="internal-body" style={{
        "--ink": design.foreground,
        "--muted": design.muted,
        "--blue": design.primary,
        "--cyan": design.accent,
        "--pale": design.surface,
        "--surface": design.background,
        "--navy": design.secondary,
        "--radius": `${design.radiusLarge}px`,
        "--container-width": `${design.containerWidth}px`,
        "--section-spacing": `${design.sectionSpacing}px`,
        "--cms-motion-duration": design.motionEnabled ? "0.2s" : "0s",
      } as CSSProperties}>
        <AmbientMotion />
        <OrganizationJsonLd settings={settings} />
        <SiteHeader locale={locale} items={header} />
        {children}
        <SiteFooter locale={locale} items={footer} settings={settings} />
        <Script id="chatwoot-widget" strategy="afterInteractive">
          {`window.chatwootSettings = {"position":"right","type":"standard","launcherTitle":""};
            (function(d,t) {
              var BASE_URL="https://livechat.abrit.cloud";
              var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
              g.src=BASE_URL+"/packs/js/sdk.js";
              g.async = true;
              s.parentNode.insertBefore(g,s);
              g.onload=function(){
                window.chatwootSDK.run({
                  websiteToken: 'xErMqw6oizQvX8ruUhNE87U7',
                  baseUrl: BASE_URL
                })
              }
            })(document,"script");`}
        </Script>
      </body>
    </html>
  );
}
