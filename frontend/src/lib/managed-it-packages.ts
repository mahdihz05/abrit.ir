import type { Locale } from "@/lib/types";

export type ManagedItCycle = "quarterly" | "semiannually" | "annually";

export type ManagedItPackage = {
  key: "essential" | "standard" | "professional" | "business" | "enterprise";
  order: number;
  name: Record<Locale, string>;
  caption: Record<Locale, string>;
  includedUsers: number;
  maxExtraUsers: number;
  includedEndpoints: number;
  extraUserMonthlyToman: number;
  extraEndpointMonthlyToman: number;
  pricing: Record<ManagedItCycle, number>;
  whmcs: { slug: string };
};

export const managedItCycles = [
  { key: "quarterly", months: 3 }, { key: "semiannually", months: 6 }, { key: "annually", months: 12 },
] as const satisfies ReadonlyArray<{ key: ManagedItCycle; months: number }>;

export const managedItPackages: readonly ManagedItPackage[] = [
  { key: "essential", order: 1, name: { fa: "پایه", en: "Essential", "ar-ae": "الأساسية" }, caption: { fa: "برای تیم‌های کوچک و شروع مدیریت یکپارچه فناوری اطلاعات", en: "For small teams starting managed IT", "ar-ae": "للفرق الصغيرة التي تبدأ إدارة تقنية المعلومات" }, includedUsers: 4, maxExtraUsers: 1, includedEndpoints: 6, extraUserMonthlyToman: 1_590_000, extraEndpointMonthlyToman: 790_000, pricing: { quarterly: 37_684_500, semiannually: 73_815_000, annually: 142_968_000 }, whmcs: { slug: "basic" } },
  { key: "standard", order: 2, name: { fa: "استاندارد", en: "Standard", "ar-ae": "القياسية" }, caption: { fa: "پوشش روزمره برای تیم‌های در حال رشد", en: "Everyday coverage for growing teams", "ar-ae": "تغطية يومية للفرق النامية" }, includedUsers: 7, maxExtraUsers: 2, includedEndpoints: 12, extraUserMonthlyToman: 1_990_000, extraEndpointMonthlyToman: 990_000, pricing: { quarterly: 56_745_000, semiannually: 111_150_000, annually: 215_280_000 }, whmcs: { slug: "standard" } },
  { key: "professional", order: 3, name: { fa: "حرفه‌ای", en: "Professional", "ar-ae": "الاحترافية" }, caption: { fa: "کنترل عمیق‌تر عملیات و زیرساخت", en: "Deeper operational and infrastructure control", "ar-ae": "تحكم أعمق في العمليات والبنية التحتية" }, includedUsers: 10, maxExtraUsers: 3, includedEndpoints: 20, extraUserMonthlyToman: 2_690_000, extraEndpointMonthlyToman: 1_290_000, pricing: { quarterly: 95_739_000, semiannually: 187_530_000, annually: 363_216_000 }, whmcs: { slug: "advance" } },
  { key: "business", order: 4, name: { fa: "سازمانی", en: "Business", "ar-ae": "الأعمال" }, caption: { fa: "مدیریت پایدار فناوری اطلاعات برای سازمان‌های پویا", en: "Reliable IT management for active organizations", "ar-ae": "إدارة موثوقة لتقنية المعلومات للمؤسسات النشطة" }, includedUsers: 20, maxExtraUsers: 5, includedEndpoints: 35, extraUserMonthlyToman: 3_790_000, extraEndpointMonthlyToman: 1_790_000, pricing: { quarterly: 153_939_000, semiannually: 301_530_000, annually: 584_016_000 }, whmcs: { slug: "professionall" } },
  { key: "enterprise", order: 5, name: { fa: "سازمانی پلاس", en: "Enterprise", "ar-ae": "المؤسسات بلس" }, caption: { fa: "ظرفیت گسترده برای ساختارهای چندلایه", en: "Extended capacity for complex organizations", "ar-ae": "سعة موسعة للمؤسسات المعقدة" }, includedUsers: 30, maxExtraUsers: 7, includedEndpoints: 60, extraUserMonthlyToman: 4_990_000, extraEndpointMonthlyToman: 2_490_000, pricing: { quarterly: 232_509_000, semiannually: 455_430_000, annually: 882_096_000 }, whmcs: { slug: "vip" } },
] as const;

export function estimateManagedItPrice(product: ManagedItPackage, cycle: ManagedItCycle, users: number, endpoints: number) {
  const months = managedItCycles.find((item) => item.key === cycle)?.months ?? 3;
  const extraUsers = Math.max(0, users - product.includedUsers);
  const extraEndpoints = Math.max(0, endpoints - product.includedEndpoints);
  const extras = (extraUsers * product.extraUserMonthlyToman + extraEndpoints * product.extraEndpointMonthlyToman) * months;
  return { months, extraUsers, extraEndpoints, extras, total: product.pricing[cycle] + extras };
}

export function buildManagedItWhmcsUrl(product: ManagedItPackage) {
  return `https://my.abrit.ir/store/packages/${product.whmcs.slug}`;
}
