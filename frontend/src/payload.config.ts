import path from "node:path";
import { fileURLToPath } from "node:url";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { en } from "@payloadcms/translations/languages/en";
import { fa } from "@payloadcms/translations/languages/fa";
import { buildConfig } from "payload";
import sharp from "sharp";
import { Content } from "./payload/collections/Content";
import { AuditLogs } from "./payload/collections/AuditLogs";
import { Forms, FormSubmissions } from "./payload/collections/Forms";
import { Media } from "./payload/collections/Media";
import { Packages } from "./payload/collections/Pricing";
import { SubmissionFiles } from "./payload/collections/SubmissionFiles";
import { Users } from "./payload/collections/Users";
import { DesignSettings } from "./payload/globals/DesignSettings";
import { Navigation } from "./payload/globals/Navigation";
import { ProductCatalog } from "./payload/globals/ProductCatalog";
import { SiteSettings } from "./payload/globals/SiteSettings";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  i18n: {
    fallbackLanguage: "fa",
    supportedLanguages: { fa, en },
  },
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: "– AbrIT CMS" },
    dateFormat: "yyyy/MM/dd HH:mm",
  },
  collections: [Users, Media, Content, Packages, Forms, FormSubmissions, SubmissionFiles, AuditLogs],
  globals: [SiteSettings, DesignSettings, Navigation, ProductCatalog],
  db: postgresAdapter({ migrationDir: path.resolve(dirname, "migrations"), pool: { connectionString: process.env.DATABASE_URI ?? "" } }),
  editor: lexicalEditor(),
  localization: {
    locales: [
      { code: "fa", label: { fa: "فارسی", en: "Persian" }, rtl: true },
      { code: "en", label: { fa: "انگلیسی", en: "English" } },
      { code: "ar-ae", label: { fa: "عربی", en: "Arabic" }, rtl: true },
    ],
    defaultLocale: "fa",
    fallback: false,
  },
  experimental: { localizeStatus: true },
  secret: process.env.PAYLOAD_SECRET ?? "",
  sharp,
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
});
