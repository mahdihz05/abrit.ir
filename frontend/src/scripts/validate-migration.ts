import config from "@payload-config";
import { getPayload } from "payload";
import type { Navigation, Package as PayloadPackage } from "@/payload-types";
import type { Locale } from "@/lib/types";
import { calculatePackage } from "@/lib/pricing";
import { bool, number, readDjangoSnapshot, text, type SnapshotRow } from "./django-snapshot";

const locales: Locale[] = ["fa", "en", "ar-ae"];

function grouped(rows: SnapshotRow[], key: string) {
  const result = new Map<string, SnapshotRow[]>();
  for (const row of rows) result.set(text(row[key]), [...(result.get(text(row[key])) ?? []), row]);
  return result;
}

function assertEqual(actual: unknown, expected: unknown, label: string, errors: string[]) {
  if (actual !== expected) errors.push(`${label}: expected ${String(expected)}, received ${String(actual)}`);
}

function relationshipID(value: number | { id: number } | null | undefined) {
  return typeof value === "object" && value ? value.id : value;
}

function menuItemCount(items: Navigation["header"]) {
  return (items ?? []).reduce((total, item) => total + 1 + (item.children?.length ?? 0), 0);
}

function sourcePricingPackages(tables: Record<string, SnapshotRow[]>) {
  const terms = (tables.pricing_contractterm ?? []).filter((row) => bool(row.is_active));
  const addons = grouped(tables.pricing_addonrate ?? [], "package_id");
  return (tables.pricing_package ?? []).filter((row) => bool(row.is_active)).map((row) => {
    const rates = addons.get(text(row.id)) ?? [];
    return {
      id: number(row.order), key: text(row.key), order: number(row.order), name: text(row.key),
      baseMonthlyToman: number(row.base_monthly_toman), includedUsers: number(row.included_users), maxExtraUsers: 0,
      includedEndpoints: number(row.included_endpoints), includedServers: number(row.included_servers), includedSites: number(row.included_sites),
      extraUserMonthlyToman: number(rates.find((rate) => rate.addon_type === "user")?.monthly_toman),
      extraEndpointMonthlyToman: number(rates.find((rate) => rate.addon_type === "endpoint")?.monthly_toman),
      currency: text(row.currency), isFeatured: bool(row.is_featured), isActive: true,
      termPrices: terms.map((term) => ({
        cycle: number(term.months) === 3 ? "quarterly" as const : number(term.months) === 6 ? "semiannually" as const : "annually" as const,
        months: number(term.months), totalToman: 0, discountBps: number(term.discount_bps), onboardingBps: number(term.onboarding_bps),
      })),
      updatedAt: "", createdAt: "",
    } satisfies PayloadPackage;
  });
}

async function main() {
  if (!process.env.DATABASE_URI || !process.env.PAYLOAD_SECRET) throw new Error("DATABASE_URI and PAYLOAD_SECRET are required.");
  const snapshot = readDjangoSnapshot();
  const tables = snapshot.tables;
  const payload = await getPayload({ config });
  const errors: string[] = [];

  const sourceItems = new Map((tables.content_contentitem ?? []).map((row) => [text(row.id), row]));
  const sourceTranslations = tables.content_contenttranslation ?? [];
  for (const locale of locales) {
    const target = await payload.find({ collection: "content", locale, depth: 0, limit: 1000, overrideAccess: true });
    const byKey = new Map(target.docs.map((doc) => [doc.key, doc]));
    const expectedTranslations = sourceTranslations.filter((row) => row.locale === locale);
    for (const translation of expectedTranslations) {
      const source = sourceItems.get(text(translation.item_id));
      const key = text(source?.key);
      const document = byKey.get(key);
      if (!document) {
        errors.push(`content ${locale}/${key}: missing`);
        continue;
      }
      assertEqual(document.path, text(translation.path), `content ${locale}/${key} path`, errors);
      assertEqual(document.slug, text(translation.slug), `content ${locale}/${key} slug`, errors);
      assertEqual(document.title, text(translation.title), `content ${locale}/${key} title`, errors);
      assertEqual(document._status, text(translation.workflow_status) === "published" ? "published" : "draft", `content ${locale}/${key} status`, errors);
    }
    assertEqual(expectedTranslations.length, sourceTranslations.filter((row) => row.locale === locale).length, `content ${locale} translation count`, errors);
  }

  const parentRelations = (tables.content_contentitem ?? []).filter((row) => row.parent_id).length;
  const contentDepthZero = await payload.find({ collection: "content", depth: 0, limit: 1000, overrideAccess: true });
  assertEqual(contentDepthZero.docs.filter((doc) => relationshipID(doc.parent) !== null && relationshipID(doc.parent) !== undefined).length, parentRelations, "content parent relation count", errors);
  assertEqual(contentDepthZero.docs.reduce((sum, doc) => sum + (doc.relatedContent?.length ?? 0), 0), (tables.content_contentrelation ?? []).length, "content related relation count", errors);

  const targetPackages = (await payload.find({ collection: "packages", limit: 1000, overrideAccess: true })).docs;
  const sourcePackages = sourcePricingPackages(tables);
  for (const source of sourcePackages) {
    const target = targetPackages.find((item) => item.key === source.key);
    if (!target) {
      errors.push(`package ${source.key}: missing`);
      continue;
    }
    for (const term of source.termPrices) {
      const sourceResult = calculatePackage(sourcePackages, source.key, term.months, source.includedUsers, source.includedEndpoints);
      const targetResult = calculatePackage(targetPackages, source.key, term.months, source.includedUsers, source.includedEndpoints);
      assertEqual(targetResult.contract_total_toman, sourceResult.contract_total_toman, `package ${source.key}/${term.months} total`, errors);
      assertEqual(targetResult.monthly_recurring_toman, sourceResult.monthly_recurring_toman, `package ${source.key}/${term.months} monthly`, errors);
    }
  }

  assertEqual(targetPackages.filter((item) => sourcePackages.some((source) => source.key === item.key)).length, sourcePackages.length, "package count", errors);
  assertEqual((await payload.find({ collection: "forms", limit: 1000, overrideAccess: true })).docs.filter((form) => (tables.forms_form ?? []).some((row) => row.key === form.key)).length, (tables.forms_form ?? []).length, "form count", errors);
  assertEqual((await payload.find({ collection: "form-submissions", limit: 1000, overrideAccess: true })).docs.filter((submission) => submission.legacyID).length, (tables.forms_formsubmission ?? []).length, "submission count", errors);
  assertEqual((await payload.find({ collection: "submission-files", limit: 1000, overrideAccess: true })).docs.filter((file) => file.legacyID).length, (tables.forms_submissionfile ?? []).length, "submission file count", errors);
  assertEqual((await payload.find({ collection: "media", limit: 1000, overrideAccess: true })).docs.filter((media) => media.legacyID).length, (tables.media_mediaasset ?? []).length, "media count", errors);

  const activeMenus = tables.navigation_menu?.filter((row) => bool(row.is_active)) ?? [];
  for (const locale of locales) {
    const navigation = await payload.findGlobal({ slug: "navigation", locale, depth: 0, overrideAccess: true });
    for (const location of ["header", "footer", "mobile"] as const) {
      const menuIDs = new Set(activeMenus.filter((row) => row.location === location).map((row) => text(row.id)));
      const expected = (tables.navigation_menuitem ?? []).filter((row) => menuIDs.has(text(row.menu_id)) && bool(row.is_active)).length;
      assertEqual(menuItemCount(navigation[location]), expected, `navigation ${locale}/${location} item count`, errors);
    }
  }

  if (errors.length) {
    for (const error of errors) payload.logger.error(error);
    payload.logger.error(`Migration validation failed with ${errors.length} difference(s).`);
    process.exit(1);
  }
  payload.logger.info(`Migration validation passed for ${sourceTranslations.length} translations, ${sourcePackages.length} packages, and ${tables.forms_form?.length ?? 0} forms.`);
  process.exit(0);
}

await main();
