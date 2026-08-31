import path from "node:path";
import config from "@payload-config";
import { getPayload, type Payload } from "payload";
import type { Content, Form, Navigation } from "@/payload-types";
import type { Locale } from "@/lib/types";
import { normalizeSearchText } from "@/lib/search-normalization";
import { bool, json, number, readDjangoSnapshot, text, type SnapshotRow } from "./django-snapshot";

const locales: Locale[] = ["fa", "en", "ar-ae"];
const allowedSections = new Set(["hero", "rich_text", "service_grid", "solution_grid", "pricing", "feature_grid", "logo_cloud", "testimonials", "faq", "cta"]);

function group<T extends SnapshotRow>(rows: T[], key: string) {
  const grouped = new Map<string, T[]>();
  for (const row of rows) grouped.set(text(row[key]), [...(grouped.get(text(row[key])) ?? []), row]);
  return grouped;
}

async function migrateSettings(payload: Payload, tables: Record<string, SnapshotRow[]>) {
  const site = tables.core_sitesettings?.[0];
  const translations = tables.core_sitesettingstranslation ?? [];
  if (site) for (const locale of locales) {
    const translated = translations.find((row) => row.locale === locale);
    await payload.updateGlobal({ slug: "site-settings", locale, overrideAccess: true, data: {
      brandName: text(site.brand_name), phone: text(site.phone), email: text(site.email) || undefined,
      customerPortalURL: text(site.customer_portal_url), externalCheckoutURL: text(site.external_checkout_url), socialLinks: json(site.social_links, {}),
      address: text(translated?.address), locationLabel: text(translated?.location_label), defaultSEOTitle: text(translated?.default_seo_title), defaultSEODescription: text(translated?.default_seo_description),
    } });
  }
  const design = tables.core_designsettings?.[0];
  if (design) await payload.updateGlobal({ slug: "design-settings", overrideAccess: true, data: {
    primary: text(design.primary), secondary: text(design.secondary), accent: text(design.accent), background: text(design.background), surface: text(design.surface), foreground: text(design.foreground), muted: text(design.muted),
    radiusSmall: number(design.radius_small), radiusMedium: number(design.radius_medium), radiusLarge: number(design.radius_large), containerWidth: number(design.container_width), sectionSpacing: number(design.section_spacing), motionEnabled: bool(design.motion_enabled),
  } });
}

async function migrateMedia(payload: Payload, tables: Record<string, SnapshotRow[]>) {
  const translations = group(tables.media_mediaassettranslation ?? [], "asset_id");
  const map = new Map<string, number>();
  const mediaRoot = path.resolve(process.env.DJANGO_PUBLIC_MEDIA_ROOT || path.join(path.dirname(process.env.DJANGO_SQLITE_PATH || ""), "../media"));
  for (const asset of tables.media_mediaasset ?? []) {
    const legacyID = text(asset.id);
    const existing = await payload.find({ collection: "media", limit: 1, overrideAccess: true, where: { legacyID: { equals: legacyID } } });
    let id = existing.docs[0]?.id;
    const localized = translations.get(legacyID) ?? [];
    for (const locale of locales) {
      const translated = localized.find((row) => row.locale === locale);
      const data = { legacyID, isPublic: bool(asset.is_public), alt: text(translated?.alt_text) || text(asset.original_name) || "AbrIT media", title: text(translated?.title), caption: text(translated?.caption) };
      if (!id) {
        const relativeFile = text(asset.file);
        if (!relativeFile) continue;
        const created = await payload.create({ collection: "media", locale, overrideAccess: true, filePath: path.join(mediaRoot, relativeFile), data });
        id = created.id;
      } else await payload.update({ collection: "media", id, locale, overrideAccess: true, data });
    }
    if (id) map.set(legacyID, id);
  }
  return map;
}

async function migrateContent(payload: Payload, tables: Record<string, SnapshotRow[]>, mediaMap: Map<string, number>) {
  const translations = group(tables.content_contenttranslation ?? [], "item_id");
  const blocks = group(tables.content_contentblock ?? [], "translation_id");
  const itemMap = new Map<string, number>();
  for (const item of tables.content_contentitem ?? []) {
    const legacyID = text(item.id);
    const key = text(item.key);
    const existing = await payload.find({ collection: "content", limit: 1, overrideAccess: true, where: { key: { equals: key } } });
    let id = existing.docs[0]?.id;
    for (const translation of translations.get(legacyID) ?? []) {
      const locale = text(translation.locale) as Locale;
      if (!locales.includes(locale)) continue;
      const workflow = text(translation.workflow_status) as "draft" | "review" | "scheduled" | "published" | "archived";
      const title = text(translation.title);
      const excerpt = text(translation.excerpt);
      const layout = (blocks.get(text(translation.id)) ?? []).toSorted((left, right) => number(left.order) - number(right.order)).filter((block) => bool(block.is_active)).map((block) => ({
        blockType: "contentSection" as const,
        sectionType: (allowedSections.has(text(block.block_type)) ? text(block.block_type) : "rich_text") as NonNullable<Content["layout"]>[number]["sectionType"],
        variant: text(block.variant) as NonNullable<Content["layout"]>[number]["variant"], enabled: true, content: json(block.props, {}),
      }));
      const localizedData = {
        title, slug: text(translation.slug), path: text(translation.path), excerpt,
        workflowStatus: workflow, translationStatus: text(translation.translation_status) as Content["translationStatus"],
        legacyPublishedAt: text(translation.published_at) || undefined, searchText: normalizeSearchText(`${title} ${excerpt}`), layout,
        seo: { title: text(translation.seo_title), description: text(translation.seo_description), canonicalURL: text(translation.canonical_url), robotsIndex: bool(translation.robots_index), robotsFollow: bool(translation.robots_follow), ogTitle: text(translation.og_title), ogDescription: text(translation.og_description), ogImage: mediaMap.get(text(translation.og_image_id)) },
        _status: workflow === "published" ? "published" as const : "draft" as const,
      };
      const base = { key, kind: text(item.kind) as Content["kind"], templateKey: text(item.template_key), isActive: bool(item.is_active), ...localizedData };
      const saved = id
        ? await payload.update({ collection: "content", id, locale, overrideAccess: true, data: base })
        : await payload.create({ collection: "content", locale, overrideAccess: true, data: base });
      id = saved.id;
    }
    if (id) itemMap.set(legacyID, id);
  }
  for (const item of tables.content_contentitem ?? []) {
    const id = itemMap.get(text(item.id));
    const parent = itemMap.get(text(item.parent_id));
    if (id && parent) await payload.update({ collection: "content", id, overrideAccess: true, data: { parent } });
  }
  const related = group(tables.content_contentrelation ?? [], "source_id");
  for (const [source, relations] of related) {
    const id = itemMap.get(source);
    if (id) await payload.update({ collection: "content", id, overrideAccess: true, data: { relatedContent: relations.map((row) => itemMap.get(text(row.target_id))).filter((value): value is number => value !== undefined) } });
  }
  return itemMap;
}

async function migrateNavigation(payload: Payload, tables: Record<string, SnapshotRow[]>, contentMap: Map<string, number>) {
  const translations = group(tables.navigation_menuitemtranslation ?? [], "item_id");
  const itemsByMenu = group(tables.navigation_menuitem ?? [], "menu_id");
  const menus = tables.navigation_menu ?? [];
  for (const locale of locales) {
    const result: { header: NonNullable<Navigation["header"]>; footer: NonNullable<Navigation["footer"]>; mobile: NonNullable<Navigation["mobile"]> } = { header: [], footer: [], mobile: [] };
    for (const menu of menus.filter((row) => bool(row.is_active))) {
      const location = text(menu.location) as keyof typeof result;
      if (!(location in result)) continue;
      const rows = (itemsByMenu.get(text(menu.id)) ?? []).filter((row) => bool(row.is_active));
      const roots = rows.filter((row) => !row.parent_id).toSorted((left, right) => number(left.order) - number(right.order));
      result[location] = roots.map((row) => {
        const translated = (translations.get(text(row.id)) ?? []).find((value) => value.locale === locale);
        const targetID = contentMap.get(text(row.internal_target_id));
        const external = text(row.external_url).replace("/{locale}", "").replace(/^\//, "");
        const target = targetID ? (tables.content_contenttranslation ?? []).find((value) => value.item_id === row.internal_target_id && value.locale === locale) : undefined;
        const children = rows.filter((child) => text(child.parent_id) === text(row.id)).toSorted((left, right) => number(left.order) - number(right.order)).map((child) => {
          const childTranslation = (translations.get(text(child.id)) ?? []).find((value) => value.locale === locale);
          return { title: text(childTranslation?.title), description: text(childTranslation?.description), path: text(child.external_url).replace("/{locale}", "").replace(/^\//, ""), iconKey: text(child.icon_key), openInNewTab: bool(child.open_in_new_tab), enabled: true };
        });
        return { title: text(translated?.title), description: text(translated?.description), path: target ? text(target.path) : external, iconKey: text(row.icon_key), openInNewTab: bool(row.open_in_new_tab), enabled: true, children };
      });
    }
    await payload.updateGlobal({ slug: "navigation", locale, overrideAccess: true, data: result });
  }
}

async function migratePricing(payload: Payload, tables: Record<string, SnapshotRow[]>) {
  const translations = group(tables.pricing_packagetranslation ?? [], "package_id");
  const addons = group(tables.pricing_addonrate ?? [], "package_id");
  const terms = (tables.pricing_contractterm ?? []).filter((row) => bool(row.is_active));
  for (const item of tables.pricing_package ?? []) {
    const key = text(item.key);
    const existing = await payload.find({ collection: "packages", limit: 1, overrideAccess: true, where: { key: { equals: key } } });
    let id = existing.docs[0]?.id;
    const existingTotals = new Map((existing.docs[0]?.termPrices ?? []).map((term) => [term.months, term.totalToman]));
    for (const locale of locales) {
      const translated = (translations.get(text(item.id)) ?? []).find((row) => row.locale === locale);
      if (!translated) continue;
      const rates = addons.get(text(item.id)) ?? [];
      const data = {
        key, order: number(item.order), name: text(translated.name), caption: text(translated.description) || text(translated.audience), baseMonthlyToman: number(item.base_monthly_toman),
        includedUsers: number(item.included_users), includedEndpoints: number(item.included_endpoints), includedServers: number(item.included_servers), includedSites: number(item.included_sites),
        extraUserMonthlyToman: number(rates.find((row) => row.addon_type === "user")?.monthly_toman), extraEndpointMonthlyToman: number(rates.find((row) => row.addon_type === "endpoint")?.monthly_toman),
        currency: text(item.currency), isFeatured: bool(item.is_featured), isActive: bool(item.is_active),
        termPrices: terms.map((term) => {
          const months = number(term.months);
          const discountBps = number(term.discount_bps);
          const onboardingBps = number(term.onboarding_bps);
          const baseMonthly = number(item.base_monthly_toman);
          const calculatedTotal = baseMonthly * months
            - Math.floor((baseMonthly * months * discountBps + 5000) / 10000)
            + Math.floor((baseMonthly * onboardingBps + 5000) / 10000);
          return {
            cycle: months === 3 ? "quarterly" as const : months === 6 ? "semiannually" as const : "annually" as const,
            months,
            // Seeded public totals are canonical for the visible cards. On a
            // migration-only database the exact Django formula is the fallback.
            totalToman: existingTotals.get(months) ?? calculatedTotal,
            discountBps,
            onboardingBps,
          };
        }),
        features: [{ key: "sla", label: "SLA", value: text(translated.sla_text), included: true }],
      };
      const saved = id ? await payload.update({ collection: "packages", id, locale, overrideAccess: true, data }) : await payload.create({ collection: "packages", locale, overrideAccess: true, data });
      id = saved.id;
    }
  }
}

async function migrateForms(payload: Payload, tables: Record<string, SnapshotRow[]>) {
  const translations = group(tables.forms_formtranslation ?? [], "form_id");
  const fields = group(tables.forms_formfield ?? [], "form_id");
  const fieldTranslations = group(tables.forms_formfieldtranslation ?? [], "field_id");
  const formMap = new Map<string, number>();
  for (const source of tables.forms_form ?? []) {
    const existing = await payload.find({ collection: "forms", limit: 1, overrideAccess: true, where: { key: { equals: text(source.key) } } });
    let form: Form | undefined = existing.docs[0];
    for (const locale of locales) {
      const translated = (translations.get(text(source.id)) ?? []).find((row) => row.locale === locale);
      if (!translated) continue;
      const data = {
        key: text(source.key), isActive: bool(source.is_active), requiresPrivacyConsent: bool(source.requires_privacy_consent), retentionMonths: number(source.retention_months), successRedirect: text(source.success_redirect),
        title: text(translated.title), description: text(translated.description), successMessage: text(translated.success_message), consentLabel: text(translated.consent_label),
        fields: (fields.get(text(source.id)) ?? []).toSorted((left, right) => number(left.order) - number(right.order)).map((field) => {
          const label = (fieldTranslations.get(text(field.id)) ?? []).find((row) => row.locale === locale);
          return { key: text(field.key), fieldType: text(field.field_type) as NonNullable<Form["fields"]>[number]["fieldType"], required: bool(field.required), minValue: field.min_value === null ? undefined : number(field.min_value), maxValue: field.max_value === null ? undefined : number(field.max_value), minLength: field.min_length === null ? undefined : number(field.min_length), maxLength: field.max_length === null ? undefined : number(field.max_length), pattern: text(field.regex), options: json(field.options, []), label: text(label?.label), placeholder: text(label?.placeholder), helpText: text(label?.help_text), optionLabels: json(label?.option_labels, {}), enabled: bool(field.is_active) };
        }),
      };
      form = form ? await payload.update({ collection: "forms", id: form.id, locale, overrideAccess: true, data }) : await payload.create({ collection: "forms", locale, overrideAccess: true, data });
    }
    if (form) formMap.set(text(source.id), form.id);
  }
  const submissionMap = new Map<string, number>();
  for (const source of tables.forms_formsubmission ?? []) {
    const legacyID = text(source.id);
    const existing = await payload.find({ collection: "form-submissions", limit: 1, overrideAccess: true, where: { legacyID: { equals: legacyID } } });
    const form = formMap.get(text(source.form_id));
    if (!form) continue;
    const data = { legacyID, form, locale: text(source.locale) as Locale, data: json(source.data, {}), status: text(source.status) as "new" | "contacted" | "qualified" | "closed", sourceURL: text(source.source_url), referrer: text(source.referrer), consentGiven: bool(source.consent_given), consentText: text(source.consent_text), userAgent: text(source.user_agent), ipHash: text(source.ip_hash), expiresAt: text(source.expires_at), internalNotes: text(source.internal_notes) };
    const saved = existing.docs[0] ? await payload.update({ collection: "form-submissions", id: existing.docs[0].id, overrideAccess: true, data }) : await payload.create({ collection: "form-submissions", overrideAccess: true, data });
    submissionMap.set(legacyID, saved.id);
  }
  const privateRoot = path.resolve(process.env.DJANGO_PRIVATE_MEDIA_ROOT || path.join(path.dirname(process.env.DJANGO_SQLITE_PATH || ""), "../private-media"));
  for (const source of tables.forms_submissionfile ?? []) {
    const legacyID = text(source.id);
    const submission = submissionMap.get(text(source.submission_id));
    if (!submission) continue;
    const existing = await payload.find({ collection: "submission-files", limit: 1, overrideAccess: true, where: { legacyID: { equals: legacyID } } });
    const data = { legacyID, submission, originalName: text(source.original_name), mimeType: text(source.mime_type), size: number(source.size), checksumSHA256: text(source.checksum_sha256) };
    if (existing.docs[0]) await payload.update({ collection: "submission-files", id: existing.docs[0].id, overrideAccess: true, data });
    else await payload.create({ collection: "submission-files", overrideAccess: true, filePath: path.join(privateRoot, text(source.file)), data });
  }
}

async function migrateAuditLogs(payload: Payload, tables: Record<string, SnapshotRow[]>) {
  for (const source of tables.core_auditlog ?? []) {
    const legacyID = text(source.id);
    const existing = await payload.find({ collection: "audit-logs", limit: 1, overrideAccess: true, where: { legacyID: { equals: legacyID } } });
    if (existing.docs.length) continue;
    await payload.create({ collection: "audit-logs", overrideAccess: true, data: {
      legacyID,
      actorType: text(source.actor_type),
      action: text(source.action),
      objectType: text(source.object_type),
      objectID: text(source.object_id),
      before: json(source.before, {}),
      after: json(source.after, {}),
      occurredAt: text(source.timestamp),
    } });
  }
}

async function main() {
  if (!process.env.DATABASE_URI || !process.env.PAYLOAD_SECRET) throw new Error("DATABASE_URI and PAYLOAD_SECRET are required.");
  const snapshot = readDjangoSnapshot();
  const payload = await getPayload({ config });
  const mediaMap = await migrateMedia(payload, snapshot.tables);
  await migrateSettings(payload, snapshot.tables);
  const contentMap = await migrateContent(payload, snapshot.tables, mediaMap);
  await migrateNavigation(payload, snapshot.tables, contentMap);
  await migratePricing(payload, snapshot.tables);
  await migrateForms(payload, snapshot.tables);
  await migrateAuditLogs(payload, snapshot.tables);
  payload.logger.info(`Django migration complete from ${snapshot.source}.`);
  process.exit(0);
}

await main();
