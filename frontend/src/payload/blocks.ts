import type { Block } from "payload";

const variantOptions = ["default", "simple", "centered", "split", "dashboard", "network", "cards", "bento", "compact"];

export const ContentSection: Block = {
  slug: "contentSection",
  labels: { singular: "Content section", plural: "Content sections" },
  fields: [
    {
      name: "sectionType",
      type: "select",
      required: true,
      options: ["hero", "rich_text", "service_grid", "solution_grid", "pricing", "feature_grid", "logo_cloud", "testimonials", "faq", "cta"],
    },
    { name: "variant", type: "select", defaultValue: "default", options: variantOptions },
    { name: "enabled", type: "checkbox", defaultValue: true },
    {
      name: "content",
      type: "json",
      required: true,
      admin: { description: "Structured section properties. HTML is not accepted as a content source." },
    },
  ],
};
