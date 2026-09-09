import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { getPayload } from "payload";
import config from "@payload-config";
import type { Content } from "@/payload-types";

type DumpRecord = { model: string; pk: string; fields: Record<string, unknown> };
type Translation = { pk: string; fields: Record<string, unknown> };

const exportFile = resolve(process.cwd(), process.env.LEGACY_EXPORT_FILE ?? "../payload-legacy-export.json");

function values(records: DumpRecord[], model: string) {
  return records.filter((record) => record.model === model);
}

function stringValue(value: unknown) {
  return typeof value === "string" ? value : "";
}

async function main() {
  const dump = JSON.parse(await readFile(exportFile, "utf8")) as DumpRecord[];
  const payload = await getPayload({ config });
  const translations = values(dump, "content.contenttranslation") as Translation[];
  const blocks = values(dump, "content.contentblock");

  for (const item of values(dump, "content.contentitem")) {
    const legacyID = `django:content:${item.pk}`;
    const itemTranslations = translations.filter((translation) => String(translation.fields.item) === item.pk);
    const existing = await payload.find({ collection: "content", where: { legacyID: { equals: legacyID } }, limit: 1, depth: 0 });
    let id = existing.docs[0]?.id;

    for (const translation of itemTranslations) {
      const locale = stringValue(translation.fields.locale) as "fa" | "en" | "ar-ae";
      if (!(["fa", "en", "ar-ae"] as const).includes(locale)) continue;
      const sourceBlocks = blocks
        .filter((block) => String(block.fields.translation) === translation.pk)
        .sort((left, right) => Number(left.fields.order) - Number(right.fields.order));
      const kind = stringValue(item.fields.kind);
      const legacyKinds = ["page", "service", "solution", "knowledge", "news"] as const;
      if (!legacyKinds.includes(kind as (typeof legacyKinds)[number])) continue;
      const data = {
        legacyID,
        kind: kind as Content["kind"],
        title: stringValue(translation.fields.title),
        slug: stringValue(translation.fields.slug),
        excerpt: stringValue(translation.fields.excerpt),
        legacyPath: stringValue(translation.fields.path),
        legacyBlocks: sourceBlocks.map((block) => ({ type: block.fields.block_type, variant: block.fields.variant, props: block.fields.props })),
        seo: {
          title: stringValue(translation.fields.seo_title),
          description: stringValue(translation.fields.seo_description),
          canonical: stringValue(translation.fields.canonical_url),
          robots: translation.fields.robots_index === false ? "noindex,nofollow" as const : "index,follow" as const,
        },
        _status: translation.fields.workflow_status === "published" ? "published" as const : "draft" as const,
      };
      if (id) {
        await payload.update({ collection: "content", id, locale, data });
      } else {
        const created = await payload.create({ collection: "content", locale, data });
        id = created.id;
      }
    }
  }
}

void main();
