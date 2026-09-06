import { createRequire } from "node:module";
import { getPayload } from "payload";
import { solutions } from "@/lib/public-content";
import type { Locale } from "@/lib/types";

const { loadEnvConfig } = createRequire(import.meta.url)("@next/env") as typeof import("@next/env");
loadEnvConfig(process.cwd());
const checkOnly = process.argv.includes("--check");
const locales: Locale[] = ["fa", "en", "ar-ae"];

async function main() {
  if (!process.env.DATABASE_URI || !process.env.PAYLOAD_SECRET) throw new Error("DATABASE_URI and PAYLOAD_SECRET are required.");
  const { default: config } = await import("@payload-config");
  const payload = await getPayload({ config });
  const records = await payload.find({ collection: "content", locale: "fa", fallbackLocale: false, depth: 0, draft: true, limit: solutions.length, overrideAccess: true, where: { key: { in: solutions.map((solution) => `solution-${solution.slug}`) } } });
  const ids = solutions.map((solution) => records.docs.find((record) => record.key === `solution-${solution.slug}`)?.id);
  if (ids.some((id) => !id)) throw new Error("Required solution documents are missing.");
  for (const locale of locales) {
    const home = (await payload.find({ collection: "content", locale, fallbackLocale: false, depth: 0, draft: true, limit: 1, overrideAccess: true, where: { key: { equals: "home" } } })).docs[0];
    if (!home) throw new Error(`Home document missing for ${locale}.`);
    if (home.homepageSolutions?.length && JSON.stringify(home.homepageSolutions) !== JSON.stringify(ids)) throw new Error(`Seed conflict for home/${locale}: homepage solution order differs.`);
    if (checkOnly && JSON.stringify(home.homepageSolutions) !== JSON.stringify(ids)) throw new Error(`Homepage solutions missing for ${locale}; run without --check.`);
    if (!checkOnly && !home.homepageSolutions?.length) await payload.update({ collection: "content", id: home.id, locale, overrideAccess: true, data: { homepageSolutions: ids } as never });
  }
  payload.logger.info(`Homepage Solutions reconciliation ${checkOnly ? "check" : "complete"}: ${solutions.length} ordered relations.`);
  process.exit(0);
}
await main();
