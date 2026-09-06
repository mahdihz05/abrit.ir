import { createRequire } from "node:module";
import { getPayload } from "payload";
import { services } from "@/lib/public-content";
import type { Locale } from "@/lib/types";

const { loadEnvConfig } = createRequire(import.meta.url)("@next/env") as typeof import("@next/env");
loadEnvConfig(process.cwd());
const checkOnly = process.argv.includes("--check");
const locales: Locale[] = ["fa", "en", "ar-ae"];

async function main() {
  if (!process.env.DATABASE_URI || !process.env.PAYLOAD_SECRET) throw new Error("DATABASE_URI and PAYLOAD_SECRET are required.");
  const { default: config } = await import("@payload-config");
  const payload = await getPayload({ config });
  const records = await payload.find({ collection: "content", locale: "fa", fallbackLocale: false, depth: 0, draft: true, limit: services.length, overrideAccess: true, where: { key: { in: services.map((service) => `service-${service.slug}`) } } });
  const ids = services.map((service) => records.docs.find((record) => record.key === `service-${service.slug}`)?.id);
  if (ids.some((id) => !id)) throw new Error("Required managed-service documents are missing.");
  for (const locale of locales) {
    const home = (await payload.find({ collection: "content", locale, fallbackLocale: false, depth: 0, draft: true, limit: 1, overrideAccess: true, where: { key: { equals: "home" } } })).docs[0];
    if (!home) throw new Error(`Home document missing for ${locale}.`);
    if (home.homepageServices?.length && JSON.stringify(home.homepageServices) !== JSON.stringify(ids)) throw new Error(`Seed conflict for home/${locale}: homepage service order differs.`);
    if (checkOnly && JSON.stringify(home.homepageServices) !== JSON.stringify(ids)) throw new Error(`Homepage services missing for ${locale}; run without --check.`);
    if (!checkOnly && !home.homepageServices?.length) await payload.update({ collection: "content", id: home.id, locale, overrideAccess: true, data: { homepageServices: ids } as never });
  }
  payload.logger.info(`Homepage Services reconciliation ${checkOnly ? "check" : "complete"}: ${services.length} ordered relations.`);
  process.exit(0);
}
await main();
