import { describe, expect, it } from "vitest";
import { contentBlocks } from "./blocks";

describe("content block registry", () => {
  it("registers every supported CMS block with localized presentation fields", () => {
    expect(contentBlocks.map((block) => block.slug)).toEqual(["hero", "richText", "featureGrid", "faq", "testimonials", "cta", "form", "contentSection"]);
    for (const block of contentBlocks.filter((block) => block.slug !== "contentSection")) {
      expect(block.fields.length).toBeGreaterThan(0);
      expect(block.fields.some((field) => "localized" in field && field.localized)).toBe(true);
    }
  });
});
