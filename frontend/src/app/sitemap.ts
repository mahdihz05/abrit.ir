import type { MetadataRoute } from "next";
import { locales } from "@/lib/locales";
import { services, solutions } from "@/lib/public-content";

export default function sitemap(): MetadataRoute.Sitemap {
  const site = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://abrit.ir").replace(/\/$/, "");
  return locales.flatMap((locale) => {
    const paths = ["", "services", "solutions", "pricing", "knowledge", "news", "about", "contact", ...services.map((item) => `services/${item.slug}`), ...solutions.map((item) => `solutions/${item.slug}`)];
    return paths.map((path) => ({ url: `${site}/${locale}${path ? `/${path}` : ""}`, changeFrequency: "monthly" as const, priority: path === "" ? 1 : path.startsWith("services/") ? .8 : .7 }));
  });
}
