import type { GlobalConfig } from "payload";
import { anyone, contentEditor } from "@/payload/access";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  access: { read: anyone, update: contentEditor },
  fields: [
    { name: "brandName", type: "text", required: true, defaultValue: "AbrIT" },
    { name: "phone", type: "text" },
    { name: "email", type: "email" },
    { name: "address", type: "textarea", localized: true },
    { name: "logo", type: "upload", relationTo: "media" },
    { name: "favicon", type: "upload", relationTo: "media" },
  ],
};
