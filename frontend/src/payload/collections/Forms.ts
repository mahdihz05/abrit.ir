import type { CollectionConfig } from "payload";
import { adminOnly, anyone, formManager } from "@/payload/access";

export const Forms: CollectionConfig = {
  slug: "forms",
  admin: { useAsTitle: "title", defaultColumns: ["title", "key", "updatedAt"] },
  access: { create: formManager, delete: adminOnly, read: anyone, update: formManager },
  fields: [
    { name: "key", type: "text", required: true, unique: true, index: true },
    { name: "title", type: "text", required: true, localized: true },
    { name: "consentLabel", type: "textarea", required: true, localized: true },
    { name: "isActive", type: "checkbox", defaultValue: false },
    {
      name: "fields",
      type: "array",
      fields: [
        { name: "name", type: "text", required: true },
        { name: "label", type: "text", required: true, localized: true },
        { name: "type", type: "select", required: true, options: ["text", "textarea", "email", "phone", "select"] },
        { name: "required", type: "checkbox", defaultValue: false },
        { name: "options", type: "array", fields: [{ name: "label", type: "text", localized: true }, { name: "value", type: "text" }] },
      ],
    },
  ],
};

export const FormSubmissions: CollectionConfig = {
  slug: "form-submissions",
  admin: { useAsTitle: "formKey", defaultColumns: ["formKey", "createdAt", "status"] },
  access: { create: () => true, delete: adminOnly, read: formManager, update: formManager },
  fields: [
    { name: "formKey", type: "text", required: true, index: true },
    { name: "status", type: "select", defaultValue: "new", options: ["new", "in-progress", "resolved", "spam"] },
    { name: "data", type: "json", required: true },
    { name: "consent", type: "checkbox", required: true },
    { name: "source", type: "text" },
    { name: "ipHash", type: "text", admin: { readOnly: true } },
  ],
};
