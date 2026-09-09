import type { CollectionConfig } from "payload";
import { contentEditor } from "@/payload/access";
import { contentBlocks } from "@/payload/blocks";

export const Content: CollectionConfig = {
  slug: "content",
  admin: { useAsTitle: "title", defaultColumns: ["title", "kind", "slug", "_status", "updatedAt"] },
  access: {
    create: contentEditor,
    delete: contentEditor,
    read: ({ req }) => req.user ? true : { _status: { equals: "published" } },
    update: contentEditor,
  },
  versions: { maxPerDoc: 25, drafts: { autosave: { interval: 5000 } } },
  fields: [
    { name: "legacyID", type: "text", unique: true, admin: { readOnly: true } },
    {
      name: "kind",
      type: "select",
      required: true,
      options: ["page", "service", "solution", "independent-service", "product", "knowledge", "news"],
    },
    { name: "title", type: "text", localized: true, required: true },
    { name: "slug", type: "text", localized: true, required: true, index: true },
    { name: "excerpt", type: "textarea", localized: true },
    { name: "legacyPath", type: "text", localized: true, index: true, admin: { readOnly: true } },
    { name: "legacyBlocks", type: "json", localized: true, admin: { readOnly: true } },
    { name: "featuredImage", type: "upload", relationTo: "media" },
    { name: "blocks", type: "blocks", blocks: contentBlocks, localized: true },
    {
      name: "seo",
      type: "group",
      localized: true,
      fields: [
        { name: "title", type: "text" },
        { name: "description", type: "textarea" },
        { name: "canonical", type: "text" },
        { name: "robots", type: "select", options: ["index,follow", "noindex,nofollow"] },
        { name: "image", type: "upload", relationTo: "media" },
      ],
    },
  ],
};
