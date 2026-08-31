import type { CollectionConfig } from "payload";
import { publishedOrAuthenticated, authenticated } from "../access";
import { contentBlocks } from "../blocks";
import { revalidateContent, revalidateDeletedContent } from "../hooks/revalidate";
import { populateSearchText } from "../hooks/search-text";

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
      const path = typeof document.path === "string" ? document.path.replace(/^\/+/, "") : "";
      return `/${localeCode}${path ? `/${path}` : ""}?draft=1`;
    },
  },
  access: { create: authenticated, delete: authenticated, read: publishedOrAuthenticated, update: authenticated, readVersions: authenticated },
  versions: { drafts: { autosave: { interval: 1500, showSaveDraftButton: true }, localizeStatus: true, schedulePublish: true }, maxPerDoc: 50 },
  hooks: { beforeChange: [populateSearchText], afterChange: [revalidateContent], afterDelete: [revalidateDeletedContent] },
  fields: [
    { name: "key", type: "text", required: true, unique: true, index: true, admin: { position: "sidebar", description: "شناسهٔ فنی ثابت؛ پس از انتشار تغییر ندهید." } },
    { name: "kind", type: "select", required: true, index: true, options: ["page", "service", "solution", "knowledge", "news"], admin: { position: "sidebar" } },
    { name: "templateKey", type: "text", defaultValue: "default", required: true, admin: { position: "sidebar" } },
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
          ],
        },
        {
          label: "Routing & relations",
          description: "آدرس صفحه و ارتباط آن با محتوای دیگر",
          fields: [
            { name: "slug", type: "text", localized: true, required: true, maxLength: 180 },
            { name: "path", type: "text", localized: true, index: true, maxLength: 500, admin: { description: "بدون / ابتدایی؛ فقط صفحهٔ خانه خالی است." } },
            { name: "parent", type: "relationship", relationTo: "content", filterOptions: ({ id }) => ({ id: { not_equals: id } }) },
            { name: "relatedContent", type: "relationship", relationTo: "content", hasMany: true },
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
