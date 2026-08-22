import type { ApiEnvelope, ContentDetail, ContentSummary, Locale, NavigationItem, Package, SiteSettings } from "./types";

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api/v1").replace(/\/$/, "");

async function get<T>(path: string, tags: string[]): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { Accept: "application/json" },
    next: { revalidate: 300, tags },
  });
  if (!response.ok) throw new Error(`CMS request failed (${response.status})`);
  return ((await response.json()) as ApiEnvelope<T>).data;
}

export const cms = {
  settings: (locale: Locale) => get<SiteSettings>(`/site/settings?locale=${locale}`, [`site-settings`, `locale:${locale}`]),
  navigation: (location: "header" | "footer", locale: Locale) =>
    get<NavigationItem[]>(`/navigation/${location}/${locale}`, [`navigation:${location}`, `locale:${locale}`]),
  home: (locale: Locale) => get<ContentDetail>(`/content/${locale}/root`, ["content:home", "kind:page", `locale:${locale}`]),
  services: (locale: Locale) => get<ContentSummary[]>(`/content/collections/service/${locale}`, ["kind:service", `locale:${locale}`]),
  packages: (locale: Locale) => get<Package[]>(`/pricing/packages?locale=${locale}`, ["pricing", `locale:${locale}`]),
};
