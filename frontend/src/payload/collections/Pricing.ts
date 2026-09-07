import type { CollectionConfig } from "payload";
import { adminOnly } from "../access";
import { auditCollectionChange, auditCollectionDelete } from "../hooks/audit";

export const Packages: CollectionConfig = {
  slug: "packages",
  labels: { singular: "Package", plural: "Pricing packages" },
  admin: { group: "Commerce", useAsTitle: "name", defaultColumns: ["order", "name", "baseMonthlyToman", "isFeatured", "isActive"], listSearchableFields: ["name", "key", "caption"], description: "قیمت‌ها با تومان ذخیره می‌شوند؛ درصدها برحسب basis point هستند (۱۰۰ = ۱٪)." },
  access: { create: adminOnly, delete: adminOnly, read: () => true, update: adminOnly },
  hooks: { afterChange: [auditCollectionChange], afterDelete: [auditCollectionDelete] },
  fields: [
    { name: "key", type: "text", required: true, unique: true, index: true },
    { name: "order", type: "number", required: true, unique: true, index: true, min: 1 },
    { name: "name", type: "text", localized: true, required: true },
    { name: "caption", type: "textarea", localized: true },
    { name: "baseMonthlyToman", type: "number", required: true, min: 0 },
    { name: "includedUsers", type: "number", required: true, min: 0 },
    { name: "maxExtraUsers", type: "number", defaultValue: 0, min: 0 },
    { name: "includedEndpoints", type: "number", required: true, min: 0 },
    { name: "includedServers", type: "number", defaultValue: 0, min: 0 },
    { name: "includedSites", type: "number", defaultValue: 1, min: 0 },
    { name: "extraUserMonthlyToman", type: "number", defaultValue: 0, min: 0 },
    { name: "extraEndpointMonthlyToman", type: "number", defaultValue: 0, min: 0 },
    { name: "currency", type: "text", defaultValue: "IRT", required: true },
    { name: "isFeatured", type: "checkbox", defaultValue: false },
    { name: "isActive", type: "checkbox", defaultValue: true, index: true },
    {
      name: "termPrices",
      type: "array",
      required: true,
      fields: [
        { name: "cycle", type: "select", options: ["monthly", "quarterly", "semiannually", "annually"], required: true },
        { name: "months", type: "number", required: true, min: 1 },
        { name: "totalToman", type: "number", required: true, min: 0 },
        { name: "discountBps", type: "number", defaultValue: 0, min: 0, max: 10000 },
        { name: "onboardingBps", type: "number", defaultValue: 0, min: 0, max: 10000 },
      ],
    },
    { name: "features", type: "array", fields: [{ name: "key", type: "text", required: true }, { name: "label", type: "text", localized: true }, { name: "value", type: "text" }, { name: "included", type: "checkbox", defaultValue: true }] },
    { name: "whmcsProductId", type: "number" },
    { name: "whmcsExtraUserOptionId", type: "number" },
    { name: "whmcsExtraEndpointOptionId", type: "number" },
  ],
};
