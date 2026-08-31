import type { GlobalConfig } from "payload";
import { authenticatedGlobal } from "../access";
import { revalidateGlobal } from "../hooks/revalidate";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Site settings",
  admin: { group: "Configuration" },
  access: { read: () => true, update: authenticatedGlobal },
  hooks: { afterChange: [revalidateGlobal] },
  versions: { max: 25 },
  fields: [
    { name: "brandName", type: "text", defaultValue: "AbrIT", required: true },
    { name: "logo", type: "relationship", relationTo: "media" },
    { name: "favicon", type: "relationship", relationTo: "media" },
    { name: "phone", type: "text", defaultValue: "05131881000" },
    { name: "email", type: "email" },
    { name: "customerPortalURL", type: "text" },
    { name: "externalCheckoutURL", type: "text" },
    { name: "socialLinks", type: "json" },
    { name: "address", type: "text", localized: true },
    { name: "locationLabel", type: "text", localized: true },
    { name: "defaultSEOTitle", type: "text", localized: true, maxLength: 70 },
    { name: "defaultSEODescription", type: "textarea", localized: true, maxLength: 170 },
  ],
};
