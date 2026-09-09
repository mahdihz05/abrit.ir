import type { Locale } from "@/lib/types";

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
export const payloadSecret = process.env.PAYLOAD_SECRET;
export const databaseURI = process.env.DATABASE_URI;
export const locales = ["fa", "en", "ar-ae"] as const satisfies readonly Locale[];

export function requiredPayloadConfig() {
  if (!payloadSecret || !databaseURI) {
    throw new Error("PAYLOAD_SECRET and DATABASE_URI must be configured before Payload can start.");
  }

  return { payloadSecret, databaseURI };
}
