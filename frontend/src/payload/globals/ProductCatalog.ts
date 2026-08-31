import type { GlobalConfig } from "payload";
import { authenticatedGlobal } from "../access";
import { revalidateGlobal } from "../hooks/revalidate";

export const ProductCatalog: GlobalConfig = {
  slug: "product-catalog",
  admin: { group: "Commerce" },
  access: { read: () => true, update: authenticatedGlobal },
  hooks: { afterChange: [revalidateGlobal] },
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
