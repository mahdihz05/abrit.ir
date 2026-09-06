import { createRequire } from "node:module";
import { getPayload, type Payload } from "payload";
import {
  independentPageCopy,
  independentServiceExtensions,
  independentServices,
  type IndependentService,
  type IndependentServiceBlock,
} from "@/lib/independent-services";
import type { Locale } from "@/lib/types";

const locales: Locale[] = ["fa", "en", "ar-ae"];
const { loadEnvConfig } = createRequire(import.meta.url)("@next/env") as typeof import("@next/env");
loadEnvConfig(process.cwd());
const checkOnly = process.argv.includes("--check");
const dryRun = process.argv.includes("--dry-run");
const serviceKeys = independentServices.map((service) => `independent-service-${service.slug}`);
const canonicalKeys = ["independent-services", ...serviceKeys] as const;

type SeedRecord = {
  key: string;
  kind: "page" | "service";
  templateKey: "independent-services" | "independent-service";
  slug: string;
  path: string;
  data: (locale: Locale, relatedIDs: Map<string, number>) => Record<string, unknown>;
};

function cards(items: readonly IndependentServiceBlock[], locale: Locale) {
  return items.map((item) => ({
    title: item.title[locale],
    body: item.body[locale],
    tags: item.tags?.map((value) => ({ value })) ?? [],
  }));
}

function serviceData(service: IndependentService, locale: Locale, relatedIDs: Map<string, number>) {
  const extension = independentServiceExtensions[service.slug];
  const relatedManagedService = relatedIDs.get(`service-${service.relatedManagedSlug}`);
  if (!relatedManagedService) throw new Error(`Missing managed-service relation for ${service.slug}.`);

  return {
    code: service.code,
    category: service.category[locale],
    heroTitle: service.heroTitle[locale],
    heroBody: service.heroBody[locale],
    pulse: service.pulse.map((item) => ({ text: item[locale] })),
    overviewTitle: service.overviewTitle[locale],
    overviewBody: service.overviewBody[locale],
    contextTitle: service.contextTitle[locale],
    context: cards(service.context, locale),
    deliverablesTitle: extension.deliverablesTitle[locale],
    deliverablesBody: extension.deliverablesBody[locale],
    deliverables: cards(extension.deliverables, locale),
    capabilitiesTitle: service.capabilitiesTitle[locale],
    capabilities: cards(service.capabilities, locale),
    architectureTitle: service.architectureTitle[locale],
    architectureBody: service.architectureBody[locale],
    architecture: cards(service.architecture, locale),
    showcaseTitle: service.showcaseTitle[locale],
    showcaseBody: service.showcaseBody[locale],
    showcase: cards(service.showcase, locale),
    processTitle: service.processTitle[locale],
    process: cards(service.process, locale),
    technologies: service.technologies.map((name) => ({ name })),
    ctaTitle: service.ctaTitle[locale],
    ctaBody: service.ctaBody[locale],
    managedScopeTitle: extension.managedScopeTitle[locale],
    managedScopeBody: extension.managedScopeBody[locale],
    managedScope: cards(extension.managedScope, locale),
    relatedManagedService,
    comparison: service.comparison
      ? {
          intro: service.comparison.intro[locale],
          columns: service.comparison.columns.map((column) => ({ label: column[locale] })),
          rows: service.comparison.rows.map((row) => ({
            label: row.label[locale],
            values: row.values.map((value) => ({ value: value[locale] })),
          })),
        }
      : undefined,
    faqTitle: extension.faqTitle[locale],
    faqs: extension.faqs.map((item) => ({ question: item.question[locale], answer: item.answer[locale] })),
  };
}

const records: SeedRecord[] = [
  {
    key: "independent-services",
    kind: "page",
    templateKey: "independent-services",
    slug: "independent-services",
    path: "independent-services",
    data: (locale, relatedIDs) => ({
      title: independentPageCopy.title[locale],
      excerpt: independentPageCopy.intro[locale],
      slug: "independent-services",
      path: "independent-services",
      translationStatus: "reviewed",
      workflowStatus: "published",
      _status: "published",
      serviceListing: {
        eyebrow: independentPageCopy.eyebrow[locale],
        exploreLabel: independentPageCopy.explore[locale],
        consultLabel: independentPageCopy.consult[locale],
        backLabel: independentPageCopy.back[locale],
        familyTitle: independentPageCopy.familyTitle[locale],
        familyBody: independentPageCopy.familyBody[locale],
        familyStages: cards(independentPageCopy.familyStages, locale),
        decisionTitle: independentPageCopy.decisionTitle[locale],
        decisionBody: independentPageCopy.decisionBody[locale],
        decisions: cards(independentPageCopy.decisions, locale),
        overviewLabel: independentPageCopy.overview[locale],
        deliverablesLabel: independentPageCopy.deliverables[locale],
        capabilitiesLabel: independentPageCopy.capabilities[locale],
        architectureLabel: independentPageCopy.architecture[locale],
        processLabel: independentPageCopy.process[locale],
        technologiesLabel: independentPageCopy.technologies[locale],
        comparisonLabel: independentPageCopy.comparison[locale],
        managedScopeLabel: independentPageCopy.managedScope[locale],
        faqLabel: independentPageCopy.faq[locale],
        relatedLabel: independentPageCopy.related[locale],
        services: independentServices.map((service) => {
          const id = relatedIDs.get(`independent-service-${service.slug}`);
          if (!id) throw new Error(`Missing independent-service relation for ${service.slug}.`);
          return id;
        }),
      },
    }),
  },
  ...independentServices.map((service): SeedRecord => ({
    key: `independent-service-${service.slug}`,
    kind: "service",
    templateKey: "independent-service",
    slug: service.slug,
    path: `independent-services/${service.slug}`,
    data: (locale, relatedIDs) => ({
      title: service.title[locale],
      excerpt: service.heroBody[locale],
      slug: service.slug,
      path: `independent-services/${service.slug}`,
      translationStatus: "reviewed",
      workflowStatus: "published",
      _status: "published",
      serviceData: serviceData(service, locale, relatedIDs),
    }),
  })),
];

function normalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(normalize);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .filter(([key, item]) => hasMeaningfulValue(item) && !["id", "createdAt", "updatedAt"].includes(key))
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, item]) => [key, normalize(item)]),
  );
}

function equal(left: unknown, right: unknown) {
  return JSON.stringify(normalize(left)) === JSON.stringify(normalize(right));
}

function compatible(existing: unknown, expected: unknown): boolean {
  if (!hasMeaningfulValue(existing)) return true;
  if (Array.isArray(existing)) return Array.isArray(expected) && equal(existing, expected);
  if (!existing || typeof existing !== "object") return equal(existing, expected);
  if (!expected || typeof expected !== "object" || Array.isArray(expected)) return false;
  return Object.entries(existing as Record<string, unknown>)
    .filter(([key, value]) => !["id", "createdAt", "updatedAt"].includes(key) && hasMeaningfulValue(value))
    .every(([key, value]) => key in (expected as Record<string, unknown>) && compatible(value, (expected as Record<string, unknown>)[key]));
}

function hasMeaningfulValue(value: unknown): boolean {
  if (value === null || value === undefined || value === "") return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value !== "object") return true;
  return Object.entries(value as Record<string, unknown>)
    .some(([key, item]) => !["id", "createdAt", "updatedAt"].includes(key) && hasMeaningfulValue(item));
}

function incompatiblePath(existing: unknown, expected: unknown, path = "content"): string | null {
  if (Array.isArray(existing)) {
    if (!Array.isArray(expected) || existing.length !== expected.length) return `${path}.length`;
    for (let index = 0; index < existing.length; index += 1) {
      const mismatch = incompatiblePath(existing[index], expected[index], `${path}[${index}]`);
      if (mismatch) return mismatch;
    }
    return null;
  }
  if (!existing || typeof existing !== "object") return equal(existing, expected) ? null : path;
  if (!expected || typeof expected !== "object" || Array.isArray(expected)) return path;
  for (const [key, value] of Object.entries(existing as Record<string, unknown>)) {
    if (!hasMeaningfulValue(value) || ["id", "createdAt", "updatedAt"].includes(key)) continue;
    if (!(key in (expected as Record<string, unknown>))) return `${path}.${key}`;
    const mismatch = incompatiblePath(value, (expected as Record<string, unknown>)[key], `${path}.${key}`);
    if (mismatch) return mismatch;
  }
  for (const [key, value] of Object.entries(expected as Record<string, unknown>)) {
    if (!hasMeaningfulValue(value) || ["id", "createdAt", "updatedAt"].includes(key)) continue;
    if (!(key in (existing as Record<string, unknown>)) || !hasMeaningfulValue((existing as Record<string, unknown>)[key])) {
      return `${path}.${key}`;
    }
  }
  return null;
}

async function findByKey(payload: Payload, key: string, locale: Locale) {
  const result = await payload.find({
    collection: "content", locale, fallbackLocale: false, depth: 0, draft: true, limit: 2, overrideAccess: true,
    where: { key: { equals: key } },
  });
  if (result.docs.length > 1) throw new Error(`Duplicate key ${key}.`);
  return result.docs[0] ?? null;
}

async function relationIDs(payload: Payload) {
  const keys = independentServices.map((service) => `service-${service.relatedManagedSlug}`);
  const result = await payload.find({
    collection: "content", locale: "fa", fallbackLocale: false, depth: 0, draft: true, limit: keys.length, overrideAccess: true,
    where: { key: { in: keys } },
  });
  const ids = new Map(result.docs.map((document) => [document.key, Number(document.id)]));
  const missing = keys.filter((key) => !ids.has(key));
  if (missing.length) throw new Error(`Required managed-service relation documents are missing: ${missing.join(", ")}.`);
  return ids;
}

async function assertRouteAvailable(payload: Payload, record: SeedRecord, locale: Locale, expectedID?: number) {
  const result = await payload.find({
    collection: "content", locale, fallbackLocale: false, depth: 0, draft: true, limit: 2, overrideAccess: true,
    where: { path: { equals: record.path } },
  });
  if (result.docs.some((document) => Number(document.id) !== expectedID)) {
    throw new Error(`Route conflict for ${locale}/${record.path}.`);
  }
}

async function reconcileRecord(payload: Payload, record: SeedRecord, ids: Map<string, number>) {
  let existing = await findByKey(payload, record.key, "fa");
  if (existing && (existing.kind !== record.kind || existing.templateKey !== record.templateKey || existing.isActive === false)) {
    throw new Error(`Seed conflict for ${record.key}: canonical identity differs.`);
  }

  for (const locale of locales) {
    const expected = record.data(locale, ids);
    const current = await findByKey(payload, record.key, locale);
    if (current) ids.set(record.key, Number(current.id));
    await assertRouteAvailable(payload, record, locale, current ? Number(current.id) : undefined);
    const relevant = record.templateKey === "independent-services"
      ? { title: current?.title, excerpt: current?.excerpt, slug: current?.slug, path: current?.path, serviceListing: current?.serviceListing }
      : { title: current?.title, excerpt: current?.excerpt, slug: current?.slug, path: current?.path, serviceData: current?.serviceData };
    const expectedRelevant = record.templateKey === "independent-services"
      ? { title: expected.title, excerpt: expected.excerpt, slug: expected.slug, path: expected.path, serviceListing: expected.serviceListing }
      : { title: expected.title, excerpt: expected.excerpt, slug: expected.slug, path: expected.path, serviceData: expected.serviceData };
    const currentTyped = record.templateKey === "independent-services" ? current?.serviceListing : current?.serviceData;
    const expectedTyped = record.templateKey === "independent-services" ? expected.serviceListing : expected.serviceData;
    const currentBase = { title: current?.title, excerpt: current?.excerpt, slug: current?.slug, path: current?.path };
    const expectedBase = { title: expected.title, excerpt: expected.excerpt, slug: expected.slug, path: expected.path };
    const projectionInitialized = hasMeaningfulValue(currentBase);

    if (current && projectionInitialized && !equal(currentBase, expectedBase)) {
      throw new Error(`Seed conflict for ${record.key}/${locale} at ${incompatiblePath(currentBase, expectedBase) ?? "base"}: base content differs from the canonical seed.`);
    }
    const matchesKnownLocale = current && hasMeaningfulValue(currentTyped) && locales.some((candidateLocale) => {
      const candidate = record.data(candidateLocale, ids);
      const candidateTyped = record.templateKey === "independent-services" ? candidate.serviceListing : candidate.serviceData;
      return compatible(currentTyped, candidateTyped);
    });
    if (current && projectionInitialized && hasMeaningfulValue(currentTyped) && !compatible(currentTyped, expectedTyped) && !matchesKnownLocale) {
      throw new Error(`Seed conflict for ${record.key}/${locale} at ${incompatiblePath(currentTyped, expectedTyped, "typed")}: editor-managed typed content differs from the canonical seed.`);
    }
    if (checkOnly) {
      if (!current || !equal(relevant, expectedRelevant)) throw new Error(`Parity missing for ${record.key}/${locale}; run without --check.`);
      continue;
    }
    if (dryRun) {
      if (!current || !equal(relevant, expectedRelevant)) payload.logger.info(`Would reconcile ${record.key}/${locale}.`);
      continue;
    }
    if (!current) {
      existing = await payload.create({
        collection: "content", locale, overrideAccess: true,
        // The manifest's localized shape is validated by Payload at this dynamic boundary.
        data: { key: record.key, kind: record.kind, templateKey: record.templateKey, isActive: true, ...expected } as never,
      });
      ids.set(record.key, Number(existing.id));
    } else if (!equal(relevant, expectedRelevant)) {
      await payload.update({ collection: "content", id: current.id, locale, overrideAccess: true, data: expected as never });
    }
  }
}

async function verify(payload: Payload, ids: Map<string, number>) {
  const found = await payload.find({
    collection: "content", locale: "fa", fallbackLocale: false, depth: 0, draft: true, limit: 10, overrideAccess: true,
    where: { key: { in: [...canonicalKeys] } },
  });
  if (found.docs.length !== canonicalKeys.length || found.docs.some((document) => !canonicalKeys.includes(document.key as (typeof canonicalKeys)[number]))) {
    throw new Error("Canonical independent-service identity count is not exactly five.");
  }
  for (const record of records) {
    for (const locale of locales) {
      const current = await findByKey(payload, record.key, locale);
      if (!current) throw new Error(`Missing locale projection for ${record.key}/${locale}.`);
      const expected = record.data(locale, ids);
      const actual = record.templateKey === "independent-services"
        ? { title: current.title, excerpt: current.excerpt, slug: current.slug, path: current.path, serviceListing: current.serviceListing }
        : { title: current.title, excerpt: current.excerpt, slug: current.slug, path: current.path, serviceData: current.serviceData };
      const expectedRelevant = record.templateKey === "independent-services"
        ? { title: expected.title, excerpt: expected.excerpt, slug: expected.slug, path: expected.path, serviceListing: expected.serviceListing }
        : { title: expected.title, excerpt: expected.excerpt, slug: expected.slug, path: expected.path, serviceData: expected.serviceData };
      if (!equal(actual, expectedRelevant)) {
        throw new Error(`Parity mismatch for ${record.key}/${locale} at ${incompatiblePath(actual, expectedRelevant) ?? "normalized shape"}.`);
      }
    }
  }
}

async function main() {
  if (!process.env.DATABASE_URI || !process.env.PAYLOAD_SECRET) throw new Error("DATABASE_URI and PAYLOAD_SECRET are required.");
  if (records.length !== 5 || new Set(records.map((record) => record.key)).size !== 5) throw new Error("Independent-service manifest must contain exactly five unique documents.");
  const { default: config } = await import("@payload-config");
  const payload = await getPayload({ config });
  const ids = await relationIDs(payload);
  for (const record of records.slice(1)) await reconcileRecord(payload, record, ids);
  await reconcileRecord(payload, records[0], ids);
  if (!dryRun) await verify(payload, ids);
  payload.logger.info(`Independent-service reconciliation ${checkOnly ? "check" : dryRun ? "dry run" : "complete"}: 5 documents, 15 locale projections.`);
  process.exit(0);
}

await main();
