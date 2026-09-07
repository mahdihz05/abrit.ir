import type { GlobalConfig } from "payload";
import { adminOnly } from "../access";
import { revalidateGlobal } from "../hooks/revalidate";
import { auditGlobalChange } from "../hooks/audit";

export const ProductCatalog: GlobalConfig = {
  slug: "product-catalog",
  admin: { group: "Commerce" },
  access: { read: () => true, update: adminOnly },
  hooks: { afterChange: [revalidateGlobal, auditGlobalChange] },
  versions: { max: 25 },
  fields: [
    {
      name: "catalog",
      type: "json",
      required: true,
      admin: { description: "Existing product configurator data. Keep its keys and structure unchanged." },
    },
  ],
};
