import type { CollectionConfig } from "payload";
import { authenticated } from "../access";

export const Forms: CollectionConfig = {
  slug: "forms",
  admin: { group: "Forms", useAsTitle: "key" },
  access: { create: authenticated, delete: authenticated, read: authenticated, update: authenticated },
  fields: [
    { name: "key", type: "text", unique: true, required: true, index: true },
    { name: "isActive", type: "checkbox", defaultValue: true },
    { name: "requiresPrivacyConsent", type: "checkbox", defaultValue: true },
    { name: "retentionMonths", type: "number", min: 1, max: 24, defaultValue: 12, required: true },
    { name: "successRedirect", type: "text" },
    { name: "title", type: "text", localized: true, required: true },
    { name: "description", type: "textarea", localized: true },
    { name: "successMessage", type: "textarea", localized: true, required: true },
    { name: "consentLabel", type: "textarea", localized: true },
    {
      name: "fields",
      type: "array",
      fields: [
        { name: "key", type: "text", required: true },
        { name: "fieldType", type: "select", required: true, options: ["text", "textarea", "email", "phone", "number", "select", "multi-select", "radio", "checkbox", "date", "datetime", "url", "file", "hidden"] },
        { name: "required", type: "checkbox", defaultValue: false },
        { name: "minValue", type: "number" },
        { name: "maxValue", type: "number" },
        { name: "minLength", type: "number" },
        { name: "maxLength", type: "number" },
        { name: "pattern", type: "text" },
        { name: "options", type: "json" },
        { name: "label", type: "text", localized: true, required: true },
        { name: "placeholder", type: "text", localized: true },
        { name: "helpText", type: "textarea", localized: true },
        { name: "optionLabels", type: "json", localized: true },
        { name: "enabled", type: "checkbox", defaultValue: true },
      ],
    },
  ],
};

export const FormSubmissions: CollectionConfig = {
  slug: "form-submissions",
  admin: { group: "Forms", useAsTitle: "id", defaultColumns: ["form", "status", "locale", "createdAt"] },
  access: { create: () => false, delete: authenticated, read: authenticated, update: authenticated },
  fields: [
    { name: "legacyID", type: "text", unique: true, index: true, admin: { hidden: true } },
    { name: "form", type: "relationship", relationTo: "forms", required: true, index: true },
    { name: "locale", type: "select", options: ["fa", "en", "ar-ae"], required: true, index: true },
    { name: "data", type: "json", required: true },
    { name: "status", type: "select", options: ["new", "contacted", "qualified", "closed"], defaultValue: "new", required: true, index: true },
    { name: "sourceURL", type: "text" },
    { name: "referrer", type: "text" },
    { name: "consentGiven", type: "checkbox", required: true },
    { name: "consentText", type: "textarea" },
    { name: "userAgent", type: "text", maxLength: 500 },
    { name: "ipHash", type: "text", index: true, admin: { hidden: true } },
    { name: "expiresAt", type: "date", required: true, index: true },
    { name: "internalNotes", type: "textarea" },
  ],
};
