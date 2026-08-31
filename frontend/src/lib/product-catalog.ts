import type { Locale } from "./types";

export type ProductPackageKey = "basic" | "standard" | "advanced" | "professional" | "premium";
export type ContractTerm = "monthly" | "quarterly" | "semiannual";
export type ManagementLevel = "basic" | "centralized" | "professional" | "complete";
export type FeatureGroupKey = "software" | "network" | "security" | "cloud" | "capacity";
export type InfrastructureNodeKey = "internet" | "network" | "users" | "firewall" | "antivirus" | "directory" | "vpn" | "monitoring" | "server" | "cloud" | "backup";
export type LocalizedText = Record<Locale, string>;

export type ProductPackage = {
  key: ProductPackageKey;
  order: number;
  name: LocalizedText;
  tagline: LocalizedText;
  audience: LocalizedText;
  includedUsers: number;
  maxExtraUsers: number;
  whmcs: { productId: number; slug: string; extraUserOptionId: number };
  extraUserMonthlyToman: number;
  cloudGb: number;
  managedServers: number;
  criticalResponse: LocalizedText;
  prices: Record<ContractTerm, number>;
  nodes: readonly InfrastructureNodeKey[];
  moduleValues: { network: LocalizedText; security: LocalizedText; monitoring: LocalizedText };
  groups: Record<FeatureGroupKey, readonly LocalizedText[]>;
  unlocks: readonly LocalizedText[];
};

export type ProductCatalog = {
  packages: ProductPackage[];
  contractTerms: Array<{ key: ContractTerm; months: number; label: LocalizedText }>;
  managementLevels: Array<{ key: ManagementLevel; minimumOrder: number; label: LocalizedText }>;
  featureGroupLabels: Record<FeatureGroupKey, LocalizedText>;
};

export function isProductPackageKey(value: string | undefined, packages: ProductPackage[]): value is ProductPackageKey {
  return packages.some((item) => item.key === value);
}

export function calculateProductPrice(product: ProductPackage, term: ContractTerm, users: number, terms: ProductCatalog["contractTerms"]) {
  const termData = terms.find((item) => item.key === term) ?? terms[0];
  if (!termData) throw new Error("Product catalog has no contract terms.");
  const extraUsers = Math.max(0, users - product.includedUsers);
  const quoteRequired = extraUsers > product.maxExtraUsers;
  const extras = quoteRequired ? null : extraUsers * product.extraUserMonthlyToman * termData.months;
  return { extraUsers, quoteRequired, extras, total: extras === null ? null : product.prices[term] + extras };
}

const whmcsBillingCycles: Record<ContractTerm, string> = { monthly: "monthly", quarterly: "quarterly", semiannual: "semiannually" };

export function buildProductCheckoutUrl(product: ProductPackage, term: ContractTerm, extraUsers: number) {
  const safeExtraUsers = Math.min(product.maxExtraUsers, Math.max(0, Math.trunc(extraUsers)));
  const url = new URL("/cart.php", "https://my.abrit.ir");
  url.searchParams.set("a", "add");
  url.searchParams.set("pid", String(product.whmcs.productId));
  url.searchParams.set("billingcycle", whmcsBillingCycles[term]);
  url.searchParams.set(`configoption[${product.whmcs.extraUserOptionId}]`, String(safeExtraUsers));
  return url.toString();
}
