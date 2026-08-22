import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { localeMeta, locales, isLocale } from "@/lib/locales";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://abrit.ir"),
  title: { default: "AbrIT", template: "%s | AbrIT" },
  description: "Managed IT, security, infrastructure and automation.",
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const meta = localeMeta[locale];
  return (
    <html lang={meta.lang} dir={meta.dir}>
      <body>{children}</body>
    </html>
  );
}
