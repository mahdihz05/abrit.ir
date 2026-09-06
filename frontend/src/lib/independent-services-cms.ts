import type { Content } from "@/payload-types";
import type { ContentDetail, ContentSummary, Locale } from "./types";

export const independentServiceSlugs = ["backup", "cloud-storage", "workspace", "voice"] as const;
export type IndependentServiceSlug = (typeof independentServiceSlugs)[number];
export type LocalizedText = Record<Locale, string>;
export type IndependentServiceBlock = { title: LocalizedText; body: LocalizedText; tags?: string[] };
export type IndependentServiceFaq = { question: LocalizedText; answer: LocalizedText };

export type IndependentService = {
  slug: IndependentServiceSlug;
  code: string;
  title: LocalizedText;
  category: LocalizedText;
  heroTitle: LocalizedText;
  heroBody: LocalizedText;
  pulse: LocalizedText[];
  overviewTitle: LocalizedText;
  overviewBody: LocalizedText;
  contextTitle: LocalizedText;
  context: IndependentServiceBlock[];
  deliverablesTitle: LocalizedText;
  deliverablesBody: LocalizedText;
  deliverables: IndependentServiceBlock[];
  capabilitiesTitle: LocalizedText;
  capabilities: IndependentServiceBlock[];
  architectureTitle: LocalizedText;
  architectureBody: LocalizedText;
  architecture: IndependentServiceBlock[];
  showcaseTitle: LocalizedText;
  showcaseBody: LocalizedText;
  showcase: IndependentServiceBlock[];
  processTitle: LocalizedText;
  process: IndependentServiceBlock[];
  technologies: string[];
  ctaTitle: LocalizedText;
  ctaBody: LocalizedText;
  managedScopeTitle: LocalizedText;
  managedScopeBody: LocalizedText;
  managedScope: IndependentServiceBlock[];
  faqTitle: LocalizedText;
  faqs: IndependentServiceFaq[];
  comparison?: { intro: LocalizedText; columns: LocalizedText[]; rows: Array<{ label: LocalizedText; values: LocalizedText[] }> };
};

export type IndependentServicesCopy = {
  title: LocalizedText;
  intro: LocalizedText;
  eyebrow: LocalizedText;
  explore: LocalizedText;
  consult: LocalizedText;
  back: LocalizedText;
  overview: LocalizedText;
  deliverables: LocalizedText;
  capabilities: LocalizedText;
  architecture: LocalizedText;
  process: LocalizedText;
  technologies: LocalizedText;
  comparison: LocalizedText;
  managedScope: LocalizedText;
  faq: LocalizedText;
  related: LocalizedText;
  familyTitle: LocalizedText;
  familyBody: LocalizedText;
  familyStages: IndependentServiceBlock[];
  decisionTitle: LocalizedText;
  decisionBody: LocalizedText;
  decisions: IndependentServiceBlock[];
};

export type IndependentServicesListingData = { copy: IndependentServicesCopy; services: IndependentService[] };
export type IndependentServiceDetailData = { service: IndependentService; relatedManaged: ContentSummary | null };

const localized = (value: string): LocalizedText => ({ fa: value, en: value, "ar-ae": value });
const text = (value: unknown): value is string => typeof value === "string" && value.length > 0;
const slug = (value: string): value is IndependentServiceSlug => independentServiceSlugs.includes(value as IndependentServiceSlug);

function blocks(value: unknown): IndependentServiceBlock[] | null {
  if (!Array.isArray(value) || value.length === 0) return null;
  const mapped = value.map((item) => {
    if (!item || typeof item !== "object") return null;
    const row = item as { title?: unknown; body?: unknown; tags?: Array<{ value?: unknown }> | null };
    if (!text(row.title) || !text(row.body)) return null;
    const tags = row.tags?.map((tag) => tag.value).filter(text);
    return { title: localized(row.title), body: localized(row.body), ...(tags?.length ? { tags } : {}) };
  });
  return mapped.every((item): item is IndependentServiceBlock => item !== null) ? mapped : null;
}

type ServiceDocument = { key: string; kind: string; templateKey: string; slug: string; title: string; isActive?: boolean | null; _status?: string | null; serviceData?: Content["serviceData"] | null };

function service(document: ServiceDocument): IndependentService | null {
  if (document.isActive === false || (document._status && document._status !== "published")) return null;
  if (document.kind !== "service" || document.templateKey !== "independent-service" || !slug(document.slug)) return null;
  if (document.key !== `independent-service-${document.slug}` || !text(document.title)) return null;
  const data = document.serviceData;
  if (!data) return null;
  const requiredText = [data.code, data.category, data.heroTitle, data.heroBody, data.overviewTitle, data.overviewBody,
    data.contextTitle, data.deliverablesTitle, data.deliverablesBody, data.capabilitiesTitle, data.architectureTitle,
    data.architectureBody, data.showcaseTitle, data.showcaseBody, data.processTitle, data.ctaTitle, data.ctaBody,
    data.managedScopeTitle, data.managedScopeBody, data.faqTitle];
  if (!requiredText.every(text)) return null;
  const [code, category, heroTitle, heroBody, overviewTitle, overviewBody, contextTitle, deliverablesTitle, deliverablesBody,
    capabilitiesTitle, architectureTitle, architectureBody, showcaseTitle, showcaseBody, processTitle, ctaTitle, ctaBody,
    managedScopeTitle, managedScopeBody, faqTitle] = requiredText as string[];
  const context = blocks(data.context);
  const deliverables = blocks(data.deliverables);
  const capabilities = blocks(data.capabilities);
  const architecture = blocks(data.architecture);
  const showcase = blocks(data.showcase);
  const process = blocks(data.process);
  const managedScope = blocks(data.managedScope);
  const pulse = data.pulse?.map((item) => item.text).filter(text);
  const technologies = data.technologies?.map((item) => item.name).filter(text);
  const faqs = data.faqs?.map((item) => text(item.question) && text(item.answer)
    ? { question: localized(item.question), answer: localized(item.answer) }
    : null);
  if (!context || !deliverables || !capabilities || !architecture || !showcase || !process || !managedScope || !pulse?.length || !technologies?.length || !faqs?.length || faqs.some((item) => item === null)) return null;
  const comparisonRowsValid = data.comparison?.columns?.length && data.comparison.rows?.length
    && data.comparison.columns.every((item) => text(item.label))
    && data.comparison.rows.every((row) => text(row.label) && row.values?.length === data.comparison!.columns!.length - 1 && row.values.every((item) => text(item.value)));
  if (data.comparison && (text(data.comparison.intro) || data.comparison.columns?.length || data.comparison.rows?.length) && (!text(data.comparison.intro) || !comparisonRowsValid)) return null;
  const comparison = data.comparison && text(data.comparison.intro) && comparisonRowsValid
    ? { intro: localized(data.comparison.intro), columns: data.comparison.columns!.map((item) => localized(item.label)), rows: data.comparison.rows!.map((row) => ({ label: localized(row.label), values: row.values!.map((item) => localized(item.value)) })) }
    : undefined;
  return {
    slug: document.slug, code, title: localized(document.title), category: localized(category),
    heroTitle: localized(heroTitle), heroBody: localized(heroBody), pulse: pulse.map(localized),
    overviewTitle: localized(overviewTitle), overviewBody: localized(overviewBody), contextTitle: localized(contextTitle), context,
    deliverablesTitle: localized(deliverablesTitle), deliverablesBody: localized(deliverablesBody), deliverables,
    capabilitiesTitle: localized(capabilitiesTitle), capabilities, architectureTitle: localized(architectureTitle),
    architectureBody: localized(architectureBody), architecture, showcaseTitle: localized(showcaseTitle),
    showcaseBody: localized(showcaseBody), showcase, processTitle: localized(processTitle), process, technologies,
    ctaTitle: localized(ctaTitle), ctaBody: localized(ctaBody), managedScopeTitle: localized(managedScopeTitle),
    managedScopeBody: localized(managedScopeBody), managedScope, faqTitle: localized(faqTitle),
    faqs: faqs as IndependentServiceFaq[], ...(comparison ? { comparison } : {}),
  };
}

export function independentServicesListingFromCMS(content: ContentDetail | null): IndependentServicesListingData | null {
  if (!content || content.key !== "independent-services" || content.kind !== "page" || content.templateKey !== "independent-services") return null;
  const data = content.serviceListing;
  if (!data || !text(content.title) || !text(content.excerpt)) return null;
  const labels = [data.eyebrow, data.exploreLabel, data.consultLabel, data.backLabel, data.overviewLabel, data.deliverablesLabel,
    data.capabilitiesLabel, data.architectureLabel, data.processLabel, data.technologiesLabel, data.comparisonLabel,
    data.managedScopeLabel, data.faqLabel, data.relatedLabel, data.familyTitle, data.familyBody, data.decisionTitle, data.decisionBody];
  const familyStages = blocks(data.familyStages);
  const decisions = blocks(data.decisions);
  const services = data.services?.map((item) => typeof item === "object" ? service(item) : null);
  const serviceSlugs = services?.flatMap((item) => item ? [item.slug] : []) ?? [];
  if (!labels.every(text) || !familyStages || !decisions || services?.length !== 4 || services.some((item) => item === null)
    || new Set(serviceSlugs).size !== 4 || independentServiceSlugs.some((item) => !serviceSlugs.includes(item))) return null;
  const copy: IndependentServicesCopy = {
    title: localized(content.title), intro: localized(content.excerpt), eyebrow: localized(data.eyebrow!), explore: localized(data.exploreLabel!),
    consult: localized(data.consultLabel!), back: localized(data.backLabel!), overview: localized(data.overviewLabel!),
    deliverables: localized(data.deliverablesLabel!), capabilities: localized(data.capabilitiesLabel!), architecture: localized(data.architectureLabel!),
    process: localized(data.processLabel!), technologies: localized(data.technologiesLabel!), comparison: localized(data.comparisonLabel!),
    managedScope: localized(data.managedScopeLabel!), faq: localized(data.faqLabel!), related: localized(data.relatedLabel!),
    familyTitle: localized(data.familyTitle!), familyBody: localized(data.familyBody!), familyStages,
    decisionTitle: localized(data.decisionTitle!), decisionBody: localized(data.decisionBody!), decisions,
  };
  return { copy, services: services as IndependentService[] };
}

export function independentServiceFromCMS(content: ContentDetail | null, expectedSlug: string): IndependentServiceDetailData | null {
  if (!content || content.slug !== expectedSlug) return null;
  const mapped = service({ ...content, serviceData: content.serviceData });
  if (!mapped) return null;
  const related = content.serviceData?.relatedManagedService;
  const relatedManaged = related && typeof related === "object" && related._status === "published" && related.isActive !== false
    ? { id: String(related.id), key: related.key, kind: related.kind, locale: content.locale, title: related.title, slug: related.slug,
        url: `/${content.locale}${related.path ? `/${related.path}` : ""}`, excerpt: related.excerpt ?? "", published_at: related.updatedAt }
    : null;
  return { service: mapped, relatedManaged };
}
