import type { Block, Field } from "payload";

const linkFields: Field[] = [
  { name: "label", type: "text", required: true },
  { name: "href", type: "text", required: true },
];

export const Hero: Block = {
  slug: "hero",
  interfaceName: "HeroBlock",
  fields: [
    { name: "eyebrow", type: "text" },
    { name: "heading", type: "text", required: true },
    { name: "description", type: "textarea" },
    { name: "primaryAction", type: "group", fields: linkFields },
    { name: "secondaryAction", type: "group", fields: linkFields },
    { name: "image", type: "upload", relationTo: "media" },
  ],
};

export const FeatureGrid: Block = {
  slug: "featureGrid",
  interfaceName: "FeatureGridBlock",
  fields: [
    { name: "eyebrow", type: "text" },
    { name: "heading", type: "text", required: true },
    {
      name: "items",
      type: "array",
      minRows: 1,
      fields: [
        { name: "title", type: "text", required: true },
        { name: "description", type: "textarea" },
        { name: "icon", type: "text" },
        { name: "href", type: "text" },
      ],
    },
  ],
};

export const Faq: Block = {
  slug: "faq",
  interfaceName: "FaqBlock",
  fields: [
    { name: "heading", type: "text", required: true },
    {
      name: "items",
      type: "array",
      fields: [
        { name: "question", type: "text", required: true },
        { name: "answer", type: "textarea", required: true },
      ],
    },
  ],
};

export const Cta: Block = {
  slug: "cta",
  interfaceName: "CtaBlock",
  fields: [
    { name: "heading", type: "text", required: true },
    { name: "description", type: "textarea" },
    { name: "action", type: "group", fields: linkFields },
  ],
};

export const contentBlocks = [Hero, FeatureGrid, Faq, Cta];
