export type Locale = "fa" | "en" | "ar-ae";

export type ApiEnvelope<T> = { data: T };

export type NavigationItem = {
  id: string;
  title: string;
  description: string;
  url: string;
  icon: string;
  column: number;
  open_in_new_tab: boolean;
  featured_image: string | null;
  children: NavigationItem[];
};

export type SiteSettings = {
  brand_name: string;
  phone: string;
  email: string;
  default_locale: Locale;
  customer_portal_url: string;
  location: string;
  address: string;
  seo: { title: string; description: string };
  logo_url: string | null;
};

export type ContentBlock = {
  id: string;
  type: "hero" | "service_grid" | "pricing" | "cta" | string;
  variant: string;
  order: number;
  props: Record<string, unknown>;
};

export type ContentSummary = {
  id: string;
  key: string;
  kind: string;
  locale: Locale;
  title: string;
  slug: string;
  url: string;
  excerpt: string;
};

export type ContentDetail = ContentSummary & {
  blocks: ContentBlock[];
  seo: {
    title: string;
    description: string;
    canonical_url: string;
    robots: { index: boolean; follow: boolean };
  };
};

export type Package = {
  key: string;
  order: number;
  name: string;
  audience: string;
  description: string;
  base_monthly_toman: number;
  currency: string;
  included_users: number;
  included_endpoints: number;
  included_servers: number;
  included_sites: number;
  sla: string;
  addon_rates: Record<string, number>;
  is_featured: boolean;
};

export type PricingResult = {
  currency: string;
  package: string;
  term_months: number;
  users: number;
  endpoints: number;
  quote_required: boolean;
  reason?: string;
  monthly_recurring_toman: number | null;
  contract_total_toman: number | null;
  lines: { key: string; amount_toman: number; quantity: number }[];
  recommended_upgrade: string | null;
};

export type SearchResult = { kind: string; title: string; summary: string; url: string };
