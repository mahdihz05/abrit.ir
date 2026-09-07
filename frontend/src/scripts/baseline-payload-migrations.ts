import { Client } from "pg";
import { createRequire } from "node:module";
import { migrations } from "../migrations";

const { loadEnvConfig } = createRequire(import.meta.url)("@next/env") as typeof import("@next/env");

const historicalMigrations = ["20260831_121030", "20260906_115746_hardening_i18n_preview", "20260906_130821_page_form_block"];
const knownMigrations = new Set(migrations.map(({ name }) => name));
const requiredTables = ["users", "content", "payload_migrations", "content_service_data_pulse", "content_blocks_form"];

async function main() {
  loadEnvConfig(process.cwd());
  if (process.env.PAYLOAD_MIGRATION_BASELINE_CONFIRM !== "I_HAVE_VERIFIED_SCHEMA") {
    throw new Error("Refusing to baseline migrations. Set PAYLOAD_MIGRATION_BASELINE_CONFIRM=I_HAVE_VERIFIED_SCHEMA after restoring and verifying a database backup.");
  }
  if (!process.env.DATABASE_URI) throw new Error("DATABASE_URI is required.");

  const client = new Client({ connectionString: process.env.DATABASE_URI });
  await client.connect();
  try {
    await client.query("BEGIN");
    const tables = await client.query<{ table_name: string }>("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = ANY($1)", [requiredTables]);
    const found = new Set(tables.rows.map(({ table_name }) => table_name));
    const missing = requiredTables.filter((table) => !found.has(table));
    if (missing.length) throw new Error(`Database is not a verified legacy Payload schema; missing: ${missing.join(", ")}.`);

    const existing = await client.query<{ name: string | null }>("SELECT name FROM payload_migrations FOR UPDATE");
    const names = new Set(existing.rows.flatMap(({ name }) => name ? [name] : []));
    const unknown = [...names].filter((name) => name !== "dev" && !knownMigrations.has(name));
    if (unknown.length) throw new Error(`Database has migration history not recognized by this repository: ${unknown.join(", ")}.`);

    for (const name of historicalMigrations) {
      if (!names.has(name)) await client.query("INSERT INTO payload_migrations (name, batch) VALUES ($1, 0)", [name]);
    }
    // Payload uses this marker for schemas pushed by `next dev`. Once every
    // historical migration is verified and recorded, keeping it blocks safe,
    // forward-only migrations with an interactive destructive-data warning.
    if (names.has("dev")) await client.query("DELETE FROM payload_migrations WHERE name = 'dev'");
    await client.query("COMMIT");
    console.log("Verified historical schema and recorded the checked-in migration baseline. Run npm run migrate next.");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    await client.end();
  }
}

await main();
