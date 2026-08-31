import type { CollectionConfig } from "payload";
import { authenticated } from "../access";

export const Media: CollectionConfig = {
  slug: "media",
  admin: { group: "Content", useAsTitle: "filename" },
  access: {
    create: authenticated,
    delete: authenticated,
    read: ({ req }) => (req.user ? true : { isPublic: { equals: true } }),
    update: authenticated,
  },
  upload: {
    staticDir: "media",
    mimeTypes: ["image/*", "application/pdf"],
    imageSizes: [{ name: "card", width: 960, height: 640, position: "centre" }],
  },
  fields: [
    { name: "legacyID", type: "text", unique: true, index: true, admin: { hidden: true } },
    { name: "isPublic", type: "checkbox", defaultValue: true, index: true },
    { name: "alt", type: "text", localized: true, required: true, maxLength: 180 },
    { name: "title", type: "text", localized: true, maxLength: 180 },
    { name: "caption", type: "textarea", localized: true, maxLength: 500 },
  ],
};
