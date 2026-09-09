import { getPayload } from "payload";
import config from "@payload-config";
import { localizedPackages, services, solutions } from "@/lib/public-content";

const locales = ["fa", "en", "ar-ae"] as const;
type Locale = (typeof locales)[number];
type SeedRecord = {
  legacyID: string;
  kind: "service" | "solution";
  slug: string;
  title: Record<Locale, string>;
  excerpt: Record<Locale, string>;
};

async function upsertContent(payload: Awaited<ReturnType<typeof getPayload>>, record: SeedRecord) {
  const existing = await payload.find({ collection: "content", where: { legacyID: { equals: record.legacyID } }, limit: 1, depth: 0 });
  let id = existing.docs[0]?.id;

  for (const locale of locales) {
    const data = { legacyID: record.legacyID, kind: record.kind, title: record.title[locale], slug: record.slug, excerpt: record.excerpt[locale] };
    if (id) {
      await payload.update({ collection: "content", id, locale, data });
    } else {
      const created = await payload.create({ collection: "content", locale, data });
      id = created.id;
    }
  }
}

async function main() {
  const payload = await getPayload({ config });
  for (const service of services) await upsertContent(payload, { ...service, legacyID: `service:${service.slug}`, kind: "service" });
  for (const solution of solutions) await upsertContent(payload, { ...solution, legacyID: `solution:${solution.slug}`, kind: "solution" });

  const packageData = Object.fromEntries(locales.map((locale) => [locale, localizedPackages(locale)]));
  for (const packageKey of packageData.fa) {
    const existing = await payload.find({ collection: "packages", where: { key: { equals: packageKey.key } }, limit: 1, depth: 0 });
    let id = existing.docs[0]?.id;
    for (const locale of locales) {
      const item = packageData[locale].find((entry) => entry.key === packageKey.key);
      if (!item) continue;
      const data = {
        legacyID: `package:${item.key}`,
        key: item.key,
        name: item.name,
        description: item.description,
        order: item.order,
        baseMonthlyToman: item.base_monthly_toman,
        includedUsers: item.included_users,
        includedEndpoints: item.included_endpoints,
        includedServers: item.included_servers,
        includedSites: item.included_sites,
        sla: item.sla,
        userRateToman: item.addon_rates.user ?? 0,
        endpointRateToman: item.addon_rates.endpoint ?? 0,
        isFeatured: item.is_featured,
      };
      if (id) {
        await payload.update({ collection: "packages", id, locale, data });
      } else {
        const created = await payload.create({ collection: "packages", locale, data });
        id = created.id;
      }
    }
  }
}

void main();
