import path from "node:path";
import { fileURLToPath } from "node:url";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";
import sharp from "sharp";
import { Content } from "@/payload/collections/Content";
import { Forms, FormSubmissions } from "@/payload/collections/Forms";
import { Media } from "@/payload/collections/Media";
import { Packages } from "@/payload/collections/Packages";
import { Users } from "@/payload/collections/Users";
import { Navigation } from "@/payload/globals/Navigation";
import { SiteSettings } from "@/payload/globals/SiteSettings";
import { databaseURI, payloadSecret } from "@/lib/site-config";

const dirname = path.dirname(fileURLToPath(import.meta.url));

if (!payloadSecret || !databaseURI) {
  throw new Error("PAYLOAD_SECRET and DATABASE_URI are required to run Payload.");
}

export default buildConfig({
  admin: { user: Users.slug, importMap: { baseDir: path.resolve(dirname) } },
  collections: [Users, Media, Content, Packages, Forms, FormSubmissions],
  globals: [SiteSettings, Navigation],
  db: postgresAdapter({ migrationDir: path.resolve(dirname, "migrations"), pool: { connectionString: databaseURI } }),
  editor: lexicalEditor(),
  localization: {
    locales: [
      { code: "fa", label: "فارسی", rtl: true },
      { code: "en", label: "English" },
      { code: "ar-ae", label: "العربية", rtl: true },
    ],
    defaultLocale: "fa",
    fallback: false,
  },
  secret: payloadSecret,
  sharp,
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
});
