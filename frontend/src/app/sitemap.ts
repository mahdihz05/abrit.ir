import type { MetadataRoute } from "next";
import { cms } from "@/lib/api";
import { locales } from "@/lib/locales";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://abrit.ir").replace(/\/$/, "");
  const kinds = ["page", "service", "solution", "knowledge", "news"];
  const groups = await Promise.all(locales.flatMap((locale) => kinds.map((kind) => cms.collection(kind, locale))));
  const unique = new Map<string, MetadataRoute.Sitemap[number]>();
  for (const group of groups) for (const item of group) {
    unique.set(`${item.locale}:${item.url}`, { url: `${site}${item.url}`, changeFrequency: item.kind === "news" ? "weekly" : "monthly", priority: item.url === `/${item.locale}` ? 1 : item.kind === "service" ? .8 : .7 });
  }
  return [...unique.values()];
}
