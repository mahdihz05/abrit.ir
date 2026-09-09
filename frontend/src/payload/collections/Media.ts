import path from "node:path";
import type { CollectionConfig } from "payload";
import { adminFieldOnly, anyone, contentEditor } from "@/payload/access";

export const Media: CollectionConfig = {
  slug: "media",
  access: { create: contentEditor, delete: contentEditor, read: anyone, update: contentEditor },
  upload: {
    staticDir: path.resolve(process.cwd(), "media"),
    mimeTypes: ["image/*", "application/pdf"],
    imageSizes: [
      { name: "card", width: 720, height: 480, position: "centre" },
      { name: "hero", width: 1600, height: 900, position: "centre" },
    ],
  },
  fields: [
    { name: "alt", type: "text", required: true, localized: true },
    { name: "caption", type: "textarea", localized: true },
    { name: "isPrivate", type: "checkbox", defaultValue: false, access: { update: adminFieldOnly } },
  ],
};
