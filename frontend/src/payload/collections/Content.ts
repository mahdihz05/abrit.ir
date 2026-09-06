import type { CollectionConfig, Field } from "payload";
import { publishedOrAuthenticated, authenticated } from "../access";
import { contentBlocks } from "../blocks";
import { revalidateContent, revalidateDeletedContent } from "../hooks/revalidate";
import { populateSearchText } from "../hooks/search-text";

const localizedText = (name: string, required = false): Field => ({ name, type: "text", localized: true, required });
const localizedTextarea = (name: string, required = false): Field => ({ name, type: "textarea", localized: true, required });
const cards = (name: string): Field => ({
  name,
  type: "array",
  localized: true,
  fields: [{ name: "title", type: "text", required: true }, { name: "body", type: "textarea", required: true }, { name: "tags", type: "array", fields: [{ name: "value", type: "text", required: true }] }],
});

const validateTemplateGroup = (templateKey: string, requiredFields: string[]) => (
  value: unknown,
  { data }: { data: unknown },
) => {
  const document = data as { templateKey?: string } | undefined;
  if (document?.templateKey !== templateKey) return true;
  if (!value || typeof value !== "object" || Array.isArray(value)) return `The ${templateKey} template data is required.`;
  const group = value as Record<string, unknown>;
  const missing = requiredFields.find((field) => {
    const fieldValue = group[field];
    return fieldValue === undefined || fieldValue === null || fieldValue === "" || (Array.isArray(fieldValue) && fieldValue.length === 0);
  });
  return missing ? `The ${templateKey} template requires ${missing}.` : true;
};

const independentServiceRequiredFields = [
  "code", "category", "heroTitle", "heroBody", "pulse", "overviewTitle", "overviewBody", "contextTitle", "context",
  "deliverablesTitle", "deliverablesBody", "deliverables", "capabilitiesTitle", "capabilities", "architectureTitle",
  "architectureBody", "architecture", "showcaseTitle", "showcaseBody", "showcase", "processTitle", "process",
  "technologies", "ctaTitle", "ctaBody", "managedScopeTitle", "managedScopeBody", "managedScope", "relatedManagedService",
  "faqTitle", "faqs",
];

const independentServicesListingRequiredFields = [
  "eyebrow", "exploreLabel", "consultLabel", "backLabel", "familyTitle", "familyBody", "familyStages", "decisionTitle",
  "decisionBody", "decisions", "overviewLabel", "deliverablesLabel", "capabilitiesLabel", "architectureLabel", "processLabel",
  "technologiesLabel", "comparisonLabel", "managedScopeLabel", "faqLabel", "relatedLabel", "services",
];

const independentServiceFields: Field[] = [
  { name: "code", type: "text" },
  localizedText("category"),
  localizedText("heroTitle"),
  localizedTextarea("heroBody"),
  { name: "pulse", type: "array", localized: true, fields: [{ name: "text", type: "text", required: true }] },
  localizedText("overviewTitle"),
  localizedTextarea("overviewBody"),
   localizedText("contextTitle"), cards("context"),
   localizedText("deliverablesTitle"),
   localizedTextarea("deliverablesBody"),
   cards("deliverables"),
   localizedText("capabilitiesTitle"), cards("capabilities"),
  localizedText("architectureTitle"),
  localizedTextarea("architectureBody"), cards("architecture"),
  localizedText("showcaseTitle"),
  localizedTextarea("showcaseBody"), cards("showcase"),
  localizedText("processTitle"), cards("process"),
  { name: "technologies", type: "array", fields: [{ name: "name", type: "text", required: true }] },
   localizedText("ctaTitle"),
   localizedTextarea("ctaBody"),
   localizedText("managedScopeTitle"),
   localizedTextarea("managedScopeBody"),
   cards("managedScope"),
  {
    name: "relatedManagedService",
    type: "relationship",
    relationTo: "content",
    maxDepth: 1,
    filterOptions: { and: [{ kind: { equals: "service" } }, { templateKey: { equals: "service" } }] },
  },
  {
    name: "comparison",
    type: "group",
    fields: [localizedTextarea("intro"), { name: "columns", type: "array", localized: true, dbName: "cols", fields: [{ name: "label", type: "text", required: true }] }, { name: "rows", type: "array", localized: true, dbName: "rows", fields: [{ name: "label", type: "text", required: true }, { name: "values", type: "array", dbName: "vals", fields: [{ name: "value", type: "text", required: true }] }] }],
  },
  localizedText("faqTitle"),
  { name: "faqs", type: "array", localized: true, fields: [{ name: "question", type: "text", required: true }, { name: "answer", type: "textarea", required: true }] },
];

const independentServicesListingFields: Field[] = [
  localizedText("eyebrow"),
  localizedText("exploreLabel"),
  localizedText("consultLabel"),
  localizedText("backLabel"),
  localizedText("familyTitle"),
  localizedTextarea("familyBody"),
  cards("familyStages"),
  localizedText("decisionTitle"),
  localizedTextarea("decisionBody"),
  cards("decisions"),
  localizedText("overviewLabel"),
  localizedText("deliverablesLabel"),
  localizedText("capabilitiesLabel"),
  localizedText("architectureLabel"),
  localizedText("processLabel"),
  localizedText("technologiesLabel"),
  localizedText("comparisonLabel"),
  localizedText("managedScopeLabel"),
  localizedText("faqLabel"),
  localizedText("relatedLabel"),
  {
    name: "services",
    type: "relationship",
    relationTo: "content",
    hasMany: true,
    maxDepth: 1,
    filterOptions: { and: [{ kind: { equals: "service" } }, { templateKey: { equals: "independent-service" } }] },
    admin: { description: "ترتیب این رابطه، ترتیب نمایش کارت‌های خدمات مستقل است." },
  },
];

export const Content: CollectionConfig = {
  slug: "content",
  labels: { singular: "Content", plural: "Content" },
  admin: {
    group: "Content",
    useAsTitle: "title",
    defaultColumns: ["title", "kind", "path", "translationStatus", "_status", "updatedAt"],
    listSearchableFields: ["title", "key", "path", "excerpt"],
    enableListViewSelectAPI: true,
    description: "صفحه‌ها، سرویس‌ها، راهکارها و مطالب سایت در هر سه زبان",
    preview: (document, { locale }) => {
      const localeCode = locale || "fa";
      const isHome = document.key === "home" || document.templateKey === "home";
      const path = typeof document.path === "string" && document.path.trim()
        ? document.path.replace(/^\/+|\/+$/g, "")
        : isHome ? "" : typeof document.slug === "string" ? document.slug.replace(/^\/+|\/+$/g, "") : "";
      return `/${localeCode}${path ? `/${path}` : ""}?draft=1`;
    },
  },
  access: { create: authenticated, delete: authenticated, read: publishedOrAuthenticated, update: authenticated, readVersions: authenticated },
  versions: { drafts: { autosave: { interval: 1500, showSaveDraftButton: true }, localizeStatus: true, schedulePublish: true }, maxPerDoc: 50 },
  hooks: { beforeChange: [populateSearchText], afterChange: [revalidateContent], afterDelete: [revalidateDeletedContent] },
  fields: [
    { name: "key", type: "text", required: true, unique: true, index: true, admin: { position: "sidebar", description: "شناسهٔ فنی ثابت؛ پس از انتشار تغییر ندهید." } },
    { name: "kind", type: "select", required: true, index: true, options: ["page", "service", "solution", "knowledge", "news"], admin: { position: "sidebar" } },
    { name: "templateKey", type: "text", defaultValue: "default", required: true, admin: { position: "sidebar", description: "کلید ساختاری قالب است. مقادیر موجود را تغییر ندهید؛ خدمات مستقل از independent-service و فهرست آن از independent-services استفاده می‌کند." } },
    { name: "isActive", type: "checkbox", defaultValue: true, index: true, admin: { position: "sidebar" } },
    {
      type: "tabs",
      tabs: [
        {
          label: "Content",
          description: "متن و بخش‌های قابل نمایش صفحه",
          fields: [
            { name: "title", type: "text", localized: true, required: true, maxLength: 180 },
            { name: "excerpt", type: "textarea", localized: true, maxLength: 500 },
            { name: "layout", type: "blocks", localized: true, blocks: contentBlocks, admin: { initCollapsed: true } },
            { name: "capabilities", type: "array", fields: [{ name: "label", type: "text", localized: true, required: true }] },
            { name: "technologies", type: "array", fields: [{ name: "name", type: "text", required: true }, { name: "url", type: "text" }] },
            {
              name: "serviceData",
              type: "group",
              validate: validateTemplateGroup("independent-service", independentServiceRequiredFields),
              admin: { condition: (data) => data.templateKey === "independent-service" },
              fields: independentServiceFields,
            },
            {
              name: "serviceListing",
              type: "group",
              validate: validateTemplateGroup("independent-services", independentServicesListingRequiredFields),
              admin: { condition: (data) => data.templateKey === "independent-services" },
              fields: independentServicesListingFields,
            },
          ],
        },
        {
          label: "Routing & relations",
          description: "آدرس صفحه و ارتباط آن با محتوای دیگر",
          fields: [
            { name: "slug", type: "text", localized: true, required: true, maxLength: 180 },
            {
              name: "path", type: "text", localized: true, index: true, maxLength: 500,
              validate: (value: unknown, { data }: { data?: { templateKey?: unknown } }) => data?.templateKey === "home" || (typeof value === "string" && value.trim().length > 0) || "A localized path is required for every non-home document.",
              admin: { description: "بدون / ابتدایی؛ فقط صفحهٔ خانه خالی است." },
            },
            { name: "parent", type: "relationship", relationTo: "content", filterOptions: ({ id }) => ({ id: { not_equals: id } }) },
            { name: "relatedContent", type: "relationship", relationTo: "content", hasMany: true },
            {
              name: "homepageServices",
              type: "relationship",
              relationTo: "content",
              hasMany: true,
              maxDepth: 1,
              filterOptions: { and: [{ kind: { equals: "service" } }, { templateKey: { equals: "service" } }] },
              admin: { condition: (data) => data.templateKey === "home", description: "ترتیب نمایش خدمات در صفحهٔ اصلی." },
            },
            {
              name: "homepageSolutions",
              type: "relationship",
              relationTo: "content",
              hasMany: true,
              maxDepth: 1,
              filterOptions: { and: [{ kind: { equals: "solution" } }, { templateKey: { equals: "solution" } }] },
              admin: { condition: (data) => data.templateKey === "home", description: "ترتیب نمایش راهکارها در صفحهٔ اصلی." },
            },
          ],
        },
        {
          label: "SEO",
          description: "اگر خالی باشد عنوان و خلاصهٔ خود محتوا استفاده می‌شود.",
          fields: [{
            name: "seo",
            type: "group",
            fields: [
              { name: "title", type: "text", localized: true, maxLength: 70 },
              { name: "description", type: "textarea", localized: true, maxLength: 170 },
              { name: "canonicalURL", type: "text", localized: true },
              { name: "robotsIndex", type: "checkbox", defaultValue: true },
              { name: "robotsFollow", type: "checkbox", defaultValue: true },
              { name: "ogTitle", type: "text", localized: true, maxLength: 100 },
              { name: "ogDescription", type: "textarea", localized: true, maxLength: 220 },
              { name: "ogImage", type: "relationship", relationTo: "media" },
            ],
          }],
        },
      ],
    },
    { name: "searchText", type: "text", localized: true, index: true, admin: { hidden: true } },
    {
      name: "translationStatus",
      type: "select",
      localized: true,
      defaultValue: "draft",
      options: ["missing", "draft", "translated", "reviewed", "outdated"],
      admin: { position: "sidebar" },
    },
    { name: "workflowStatus", type: "select", localized: true, defaultValue: "draft", options: ["draft", "review", "scheduled", "published", "archived"], admin: { position: "sidebar" } },
    { name: "legacyPublishedAt", type: "date", localized: true, admin: { position: "sidebar", date: { pickerAppearance: "dayAndTime" } } },
  ],
  indexes: [{ fields: ["kind", "isActive"] }],
};
