import type { GlobalConfig } from "payload";
import { anyone, contentEditor } from "@/payload/access";

export const Navigation: GlobalConfig = {
  slug: "navigation",
  access: { read: anyone, update: contentEditor },
  fields: [
    {
      name: "header",
      type: "array",
      localized: true,
      fields: [
        { name: "label", type: "text", required: true },
        { name: "href", type: "text", required: true },
        { name: "description", type: "text" },
      ],
    },
    {
      name: "footer",
      type: "array",
      localized: true,
      fields: [
        { name: "label", type: "text", required: true },
        { name: "href", type: "text", required: true },
      ],
    },
  ],
};
