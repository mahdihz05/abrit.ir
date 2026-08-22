import type { Metadata } from "next";
import { localeMeta, locales } from "./locales";
import type { ContentDetail, Locale } from "./types";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://abrit.ir").replace(/\/$/, "");

function absoluteUrl(pathOrUrl: string) {
  return /^https?:\/\//.test(pathOrUrl) ? pathOrUrl : `${SITE_URL}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

export function contentMetadata(content: ContentDetail): Metadata {
  const canonical = absoluteUrl(content.seo.canonical_url || content.url);
  const languages = Object.fromEntries(
    content.alternates.map((alternate) => [localeMeta[alternate.locale].lang, absoluteUrl(alternate.url)]),
  );
  const persian = content.alternates.find((alternate) => alternate.locale === "fa");
  if (persian) languages["x-default"] = absoluteUrl(persian.url);
  const image = content.seo.open_graph.image;

  return {
    title: content.seo.title,
    description: content.seo.description,
    alternates: { canonical, languages },
    robots: {
      index: content.seo.robots.index,
      follow: content.seo.robots.follow,
      googleBot: { index: content.seo.robots.index, follow: content.seo.robots.follow },
    },
    openGraph: {
      type: "website",
      url: canonical,
      title: content.seo.open_graph.title,
      description: content.seo.open_graph.description,
      locale: localeMeta[content.locale].lang.replace("-", "_"),
      alternateLocale: content.alternates.filter((item) => item.locale !== content.locale).map((item) => localeMeta[item.locale].lang.replace("-", "_")),
      ...(image ? { images: [{ url: image, alt: content.seo.open_graph.title }] } : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: content.seo.open_graph.title,
      description: content.seo.open_graph.description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export function routeMetadata(locale: Locale, path: string, title: string, description: string): Metadata {
  const languages = Object.fromEntries(locales.map((item) => [localeMeta[item].lang, absoluteUrl(`/${item}/${path}`)]));
  languages["x-default"] = absoluteUrl(`/fa/${path}`);
  const canonical = absoluteUrl(`/${locale}/${path}`);
  return {
    title,
    description,
    alternates: { canonical, languages },
    openGraph: { type: "website", url: canonical, title, description, locale: localeMeta[locale].lang.replace("-", "_") },
  };
}

export { SITE_URL };
