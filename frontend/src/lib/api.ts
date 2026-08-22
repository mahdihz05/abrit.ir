import type { ApiEnvelope, ContentDetail, ContentSummary, Locale, NavigationItem, Package, SearchResult, SiteSettings } from "./types";

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api/v1").replace(/\/$/, "");

export class CmsError extends Error {
  constructor(public status: number, path: string) {
    super(`CMS request failed (${status}) for ${path}`);
  }
}

async function get<T>(path: string, tags: string[]): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { Accept: "application/json", "X-AbrIT-Contract-Version": "2" },
    next: { revalidate: 300, tags },
  });
  if (!response.ok) throw new CmsError(response.status, path);
  return ((await response.json()) as ApiEnvelope<T>).data;
}

export const cms = {
  settings: (locale: Locale) => get<SiteSettings>(`/site/settings?locale=${locale}`, [`site-settings`, `locale:${locale}`]),
  navigation: (location: "header" | "footer", locale: Locale) =>
    get<NavigationItem[]>(`/navigation/${location}/${locale}`, [`navigation:${location}`, `locale:${locale}`]),
  home: (locale: Locale) => get<ContentDetail>(`/content/${locale}/root`, ["content:home", "kind:page", `locale:${locale}`]),
  services: (locale: Locale) => get<ContentSummary[]>(`/content/collections/service/${locale}`, ["kind:service", `locale:${locale}`]),
  solutions: (locale: Locale) => get<ContentSummary[]>(`/content/collections/solution/${locale}`, ["kind:solution", `locale:${locale}`]),
  content: (locale: Locale, contentPath: string) => get<ContentDetail>(`/content/${locale}/${contentPath}`, [`path:${locale}:${contentPath}`, `locale:${locale}`]),
  collection: (kind: string, locale: Locale) => get<ContentSummary[]>(`/content/collections/${kind}/${locale}`, [`kind:${kind}`, `locale:${locale}`]),
  search: (locale: Locale, query: string) => get<SearchResult[]>(`/search?locale=${locale}&q=${encodeURIComponent(query)}`, [`search:${locale}:${query}`]),
  packages: (locale: Locale) => get<Package[]>(`/pricing/packages?locale=${locale}`, ["pricing", `locale:${locale}`]),
};
