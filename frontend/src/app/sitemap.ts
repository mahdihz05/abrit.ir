import type { MetadataRoute } from "next";
import { locales } from "@/lib/locales";
import { cms } from "@/lib/payload-cms";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://abrit.ir").replace(/\/$/, "");
  const entries = await Promise.all(locales.map(async (locale) => {
    const collections = await Promise.all(["page", "service", "solution", "knowledge", "news"].map((kind) => cms.collection(kind as "page", locale)));
    const contentURLs = collections.flat().map((item) => item.url);
    // Products and pricing are operational pages backed by Payload globals and
    // collections rather than standalone Content documents.
    const urls = new Set([`/${locale}/products`, `/${locale}/pricing`, ...contentURLs]);
    return [...urls].map((path) => ({
      url: `${site}${path}`,
      changeFrequency: "monthly" as const,
      priority: path === `/${locale}` ? 1 : path.includes("/services/") ? 0.8 : 0.7,
    }));
  }));
  return entries.flat();
}
