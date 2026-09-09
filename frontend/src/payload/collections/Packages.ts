import type { CollectionConfig } from "payload";
import { anyone, pricingEditor } from "@/payload/access";

export const Packages: CollectionConfig = {
  slug: "packages",
  admin: { useAsTitle: "name", defaultColumns: ["name", "baseMonthlyToman", "isFeatured", "updatedAt"] },
  access: { create: pricingEditor, delete: pricingEditor, read: anyone, update: pricingEditor },
  versions: { drafts: true },
  fields: [
    { name: "legacyID", type: "text", unique: true, admin: { readOnly: true } },
    { name: "key", type: "text", required: true, unique: true, index: true },
    { name: "name", type: "text", required: true, localized: true },
    { name: "description", type: "textarea", localized: true },
    { name: "order", type: "number", required: true, min: 0, defaultValue: 0 },
    { name: "baseMonthlyToman", type: "number", required: true, min: 0 },
    { name: "includedUsers", type: "number", required: true, min: 0 },
    { name: "includedEndpoints", type: "number", required: true, min: 0 },
    { name: "includedServers", type: "number", required: true, min: 0 },
    { name: "includedSites", type: "number", required: true, min: 0 },
    { name: "sla", type: "text", localized: true },
    { name: "userRateToman", type: "number", required: true, min: 0 },
    { name: "endpointRateToman", type: "number", required: true, min: 0 },
    { name: "isFeatured", type: "checkbox", defaultValue: false },
  ],
};
