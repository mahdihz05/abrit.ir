import { cache } from "react";
import config from "@payload-config";
import { getPayload, type Where } from "payload";
import type { Content, DesignSetting, Media, Navigation, Package as PayloadPackage, SiteSetting } from "@/payload-types";
import type { ContentDetail, ContentSummary, Locale, NavigationItem, Package, SearchResult, SiteSettings } from "./types";
import { normalizeSearchText } from "./search-normalization";
import type { ManagedItCycle, ManagedItPackage } from "./managed-it-packages";
import type { ProductCatalog } from "./product-catalog";

const payloadClient = cache(() => getPayload({ config }));

function mediaURL(value: number | Media | null | undefined) {
  return value && typeof value === "object" ? value.url ?? null : null;
}

function summary(document: Content, locale: Locale): ContentSummary {
  return {
    id: String(document.id),
    key: document.key,
    kind: document.kind,
    locale,
    title: document.title,
    slug: document.slug,
    url: `/${locale}${document.path ? `/${document.path}` : ""}`,
    excerpt: document.excerpt ?? "",
    published_at: document.updatedAt,
  };
}

async function detail(document: Content, locale: Locale): Promise<ContentDetail> {
  const payload = await payloadClient();
  const alternateResults = await Promise.all(["fa", "en", "ar-ae"].map(async (alternateLocale) => {
    const translated = await payload.findByID({ collection: "content", id: document.id, locale: alternateLocale as Locale, fallbackLocale: false, depth: 0, overrideAccess: true });
    return translated?._status === "published" && translated.path !== undefined
      ? { locale: alternateLocale as Locale, url: `/${alternateLocale}${translated.path ? `/${translated.path}` : ""}` }
      : null;
  }));
  return {
    ...summary(document, locale),
    templateKey: document.templateKey,
    blocks: (document.layout ?? []).filter((block) => block.enabled !== false).map((block, order) => {
      const value = block as unknown as Record<string, unknown>;
      const blockType = typeof value.blockType === "string" ? value.blockType : "contentSection";
      const id = typeof value.id === "string" ? value.id : `${document.id}-${order}`;
      const variant = typeof value.variant === "string" ? value.variant : "default";

      if (blockType === "contentSection") {
        const content = value.content;
        return {
          id,
          type: typeof value.sectionType === "string" ? value.sectionType : "rich_text",
          variant,
          order,
          props: typeof content === "object" && content && !Array.isArray(content) ? content as Record<string, unknown> : { value: content },
        };
      }

      const props: Record<string, unknown> = { ...value };
      delete props.id;
      delete props.blockName;
      delete props.blockType;
      delete props.enabled;
      delete props.variant;
      if (blockType === "hero" || blockType === "cta") {
        props.primary_cta = value.primaryCTA;
        props.secondary_cta = value.secondaryCTA;
        props.points = Array.isArray(value.points)
          ? value.points.map((point) => typeof point === "object" && point ? (point as { text?: unknown }).text : "").filter(Boolean)
          : [];
      }

      const typeMap: Record<string, string> = { richText: "rich_text", featureGrid: "feature_grid" };
      return { id, type: typeMap[blockType] ?? blockType, variant, order, props };
    }),
    seo: {
      title: document.seo?.title ?? document.title,
      description: document.seo?.description ?? document.excerpt ?? "",
      canonical_url: document.seo?.canonicalURL ?? "",
      robots: { index: document.seo?.robotsIndex !== false, follow: document.seo?.robotsFollow !== false },
      open_graph: {
        title: document.seo?.ogTitle ?? document.seo?.title ?? document.title,
        description: document.seo?.ogDescription ?? document.seo?.description ?? document.excerpt ?? "",
        image: mediaURL(document.seo?.ogImage),
      },
    },
    alternates: alternateResults.filter((item): item is { locale: Locale; url: string } => item !== null),
    homepageServices: (document.homepageServices ?? []).filter((item): item is Content => typeof item === "object" && item.kind === "service" && item.templateKey === "service" && item.isActive !== false && item._status === "published").map((item) => summary(item, locale)),
    homepageSolutions: (document.homepageSolutions ?? []).filter((item): item is Content => typeof item === "object" && item.kind === "solution" && item.templateKey === "solution" && item.isActive !== false && item._status === "published").map((item) => summary(item, locale)),
    serviceData: document.serviceData ?? null,
    serviceListing: document.serviceListing ?? null,
  };
}

function publishedWhere(extra: Where): Where {
  return { and: [{ _status: { equals: "published" } }, { isActive: { equals: true } }, extra] };
}

async function collection(kind: Content["kind"], locale: Locale) {
  const payload = await payloadClient();
  const result = await payload.find({
    collection: "content", locale, fallbackLocale: false, depth: 1, limit: 100, sort: "key", overrideAccess: true,
    where: publishedWhere({ kind: { equals: kind } }),
  });
  return result.docs.map((document) => summary(document, locale));
}

async function contentByPath(locale: Locale, path: string, draft = false) {
  const payload = await payloadClient();
  const result = await payload.find({
    collection: "content", locale, fallbackLocale: false, depth: 1, limit: 1, overrideAccess: true, draft,
    where: draft
      ? { and: [{ isActive: { equals: true } }, { path: { equals: path.replace(/^\/+|\/+$/g, "") } }] }
      : publishedWhere({ path: { equals: path.replace(/^\/+|\/+$/g, "") } }),
  });
  return result.docs[0] ? detail(result.docs[0], locale) : null;
}

function mapNavigation(items: NonNullable<Navigation["header"]>, locale: Locale): NavigationItem[] {
  return items.filter((item) => item.enabled !== false).map((item) => {
    const itemPath = item.path ?? "";
    return {
    id: item.id ?? `${locale}-${itemPath}`,
    title: item.title,
    description: item.description ?? "",
    url: itemPath.startsWith("http") ? itemPath : `/${locale}${itemPath ? `/${itemPath.replace(/^\//, "")}` : ""}`,
    icon: item.iconKey ?? "",
    column: 1,
    open_in_new_tab: item.openInNewTab === true,
    featured_image: null,
    children: (item.children ?? []).filter((child) => child.enabled !== false).map((child) => {
      const childPath = child.path ?? "";
      return {
      id: child.id ?? `${locale}-${childPath}`,
      title: child.title,
      description: child.description ?? "",
      url: childPath.startsWith("http") ? childPath : `/${locale}${childPath ? `/${childPath.replace(/^\//, "")}` : ""}`,
      icon: child.iconKey ?? "",
      column: 1,
      open_in_new_tab: child.openInNewTab === true,
      featured_image: null,
      children: [],
    }; }),
  }; });
}

function mapPackage(document: PayloadPackage): Package {
  return {
    key: document.key, order: document.order, name: document.name, audience: document.caption ?? "", description: document.caption ?? "",
    base_monthly_toman: document.baseMonthlyToman, currency: document.currency,
    included_users: document.includedUsers, included_endpoints: document.includedEndpoints,
    included_servers: document.includedServers ?? 0, included_sites: document.includedSites ?? 1,
    sla: document.features?.find((feature) => feature.key === "sla")?.value ?? "",
    addon_rates: { user: document.extraUserMonthlyToman ?? 0, endpoint: document.extraEndpointMonthlyToman ?? 0 },
    is_featured: document.isFeatured === true,
  };
}

export const cms = {
  home: (locale: Locale, draft = false) => contentByPath(locale, "", draft),
  content: contentByPath,
  services: (locale: Locale) => collection("service", locale),
  solutions: (locale: Locale) => collection("solution", locale),
  collection,
  settings: cache(async (locale: Locale): Promise<SiteSettings> => {
    const payload = await payloadClient();
    const value: SiteSetting = await payload.findGlobal({ slug: "site-settings", locale, fallbackLocale: false, depth: 1, overrideAccess: true });
    return {
      brand_name: value.brandName, phone: value.phone ?? "", email: value.email ?? "", default_locale: "fa",
      customer_portal_url: value.customerPortalURL ?? "", location: value.locationLabel ?? "", address: value.address ?? "",
      seo: { title: value.defaultSEOTitle ?? value.brandName, description: value.defaultSEODescription ?? "" },
      logo_url: mediaURL(value.logo),
    };
  }),
  designSettings: cache(async (): Promise<Pick<DesignSetting, "primary" | "secondary" | "accent" | "background" | "surface" | "foreground" | "muted" | "radiusSmall" | "radiusMedium" | "radiusLarge" | "containerWidth" | "sectionSpacing" | "motionEnabled">> => {
    const payload = await payloadClient();
    return payload.findGlobal({ slug: "design-settings", depth: 0, overrideAccess: true });
  }),
  navigation: cache(async (location: "header" | "footer" | "mobile", locale: Locale) => {
    const payload = await payloadClient();
    const navigation = await payload.findGlobal({ slug: "navigation", locale, fallbackLocale: false, depth: 1, overrideAccess: true });
    return mapNavigation(navigation[location] ?? [], locale);
  }),
  packages: cache(async (locale: Locale) => {
    const payload = await payloadClient();
    const result = await payload.find({ collection: "packages", locale, fallbackLocale: false, limit: 100, sort: "order", overrideAccess: true, where: { isActive: { equals: true } } });
    return result.docs.map(mapPackage);
  }),
  managedPackages: cache(async (locale: Locale): Promise<ManagedItPackage[]> => {
    const payload = await payloadClient();
    const result = await payload.find({ collection: "packages", locale, fallbackLocale: false, limit: 100, sort: "order", overrideAccess: true, where: { isActive: { equals: true } } });
    return result.docs.map((document) => {
      const pricing = Object.fromEntries(document.termPrices.map((term) => [term.cycle, term.totalToman])) as Record<ManagedItCycle, number>;
      return {
        key: document.key as ManagedItPackage["key"], order: document.order,
        name: { fa: document.name, en: document.name, "ar-ae": document.name }, caption: { fa: document.caption ?? "", en: document.caption ?? "", "ar-ae": document.caption ?? "" },
        includedUsers: document.includedUsers, maxExtraUsers: document.maxExtraUsers ?? 0, includedEndpoints: document.includedEndpoints,
        extraUserMonthlyToman: document.extraUserMonthlyToman ?? 0, extraEndpointMonthlyToman: document.extraEndpointMonthlyToman ?? 0,
        pricing, whmcs: { productId: document.whmcsProductId ?? null, extraUserOptionId: document.whmcsExtraUserOptionId ?? null, extraEndpointOptionId: document.whmcsExtraEndpointOptionId ?? null },
      };
    });
  }),
  productCatalog: cache(async (): Promise<ProductCatalog> => {
    const payload = await payloadClient();
    const value = await payload.findGlobal({ slug: "product-catalog", depth: 0, overrideAccess: true });
    return value.catalog as ProductCatalog;
  }),
  search: cache(async (locale: Locale, query: string): Promise<SearchResult[]> => {
    const normalized = normalizeSearchText(query);
    if (normalized.length < 2) return [];
    const payload = await payloadClient();
    const result = await payload.find({
      collection: "content", locale, fallbackLocale: false, limit: 30, depth: 0, overrideAccess: true,
      where: publishedWhere({ searchText: { contains: normalized } }),
    });
    return result.docs.map((document) => ({ kind: document.kind, title: document.title, summary: document.excerpt ?? "", url: `/${locale}${document.path ? `/${document.path}` : ""}` }));
  }),
};
