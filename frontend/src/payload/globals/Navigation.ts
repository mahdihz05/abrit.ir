import type { Field, GlobalConfig } from "payload";
import { authenticatedGlobal } from "../access";
import { revalidateGlobal } from "../hooks/revalidate";

const childFields: Field[] = [
  { name: "title", type: "text", localized: true, required: true },
  { name: "description", type: "textarea", localized: true },
  { name: "path", type: "text", localized: true, admin: { description: "Leave empty for the home page." } },
  { name: "iconKey", type: "text" },
  { name: "openInNewTab", type: "checkbox", defaultValue: false },
  { name: "enabled", type: "checkbox", defaultValue: true },
];

const menuField = (name: string, label: string): Field => ({
  name,
  label,
  type: "array",
  fields: [...childFields, { name: "children", type: "array", fields: childFields }],
});

export const Navigation: GlobalConfig = {
  slug: "navigation",
  admin: { group: "Configuration" },
  access: { read: () => true, update: authenticatedGlobal },
  hooks: { afterChange: [revalidateGlobal] },
  versions: { max: 25 },
  fields: [menuField("header", "Header"), menuField("footer", "Footer"), menuField("mobile", "Mobile")],
};
