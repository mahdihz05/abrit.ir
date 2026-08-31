import type { CollectionConfig } from "payload";
import { publishedOrAuthenticated, authenticated } from "../access";
import { ContentSection } from "../blocks";
import { revalidateContent, revalidateDeletedContent } from "../hooks/revalidate";
import { populateSearchText } from "../hooks/search-text";

export const Content: CollectionConfig = {
  slug: "content",
  admin: { group: "Content", useAsTitle: "title", defaultColumns: ["key", "kind", "title", "_status", "updatedAt"] },
  access: { create: authenticated, delete: authenticated, read: publishedOrAuthenticated, update: authenticated, readVersions: authenticated },
  versions: { drafts: { autosave: false, localizeStatus: true, schedulePublish: true }, maxPerDoc: 50 },
  hooks: { beforeChange: [populateSearchText], afterChange: [revalidateContent], afterDelete: [revalidateDeletedContent] },
  fields: [
    { name: "key", type: "text", required: true, unique: true, index: true },
    {
      name: "kind",
      type: "select",
      required: true,
      index: true,
      options: ["page", "service", "solution", "knowledge", "news"],
    },
    { name: "parent", type: "relationship", relationTo: "content", filterOptions: ({ id }) => ({ id: { not_equals: id } }) },
    { name: "templateKey", type: "text", defaultValue: "default", required: true },
    { name: "isActive", type: "checkbox", defaultValue: true, index: true },
    { name: "title", type: "text", localized: true, required: true, maxLength: 180 },
    { name: "slug", type: "text", localized: true, required: true, maxLength: 180 },
    { name: "path", type: "text", localized: true, index: true, maxLength: 500, admin: { description: "Leave empty only for the locale home page." } },
    { name: "excerpt", type: "textarea", localized: true },
    { name: "searchText", type: "text", localized: true, index: true, admin: { hidden: true } },
    {
      name: "translationStatus",
      type: "select",
      localized: true,
      defaultValue: "draft",
      options: ["missing", "draft", "translated", "reviewed", "outdated"],
    },
    { name: "workflowStatus", type: "select", localized: true, defaultValue: "draft", options: ["draft", "review", "scheduled", "published", "archived"] },
    { name: "legacyPublishedAt", type: "date", localized: true },
    { name: "layout", type: "blocks", localized: true, blocks: [ContentSection] },
    { name: "capabilities", type: "array", fields: [{ name: "label", type: "text", localized: true, required: true }] },
    { name: "technologies", type: "array", fields: [{ name: "name", type: "text", required: true }, { name: "url", type: "text" }] },
    { name: "relatedContent", type: "relationship", relationTo: "content", hasMany: true },
    {
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
    },
  ],
  indexes: [{ fields: ["kind", "isActive"] }],
};
