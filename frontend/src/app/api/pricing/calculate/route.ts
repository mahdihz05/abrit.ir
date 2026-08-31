import config from "@payload-config";
import { getPayload } from "payload";
import { NextResponse } from "next/server";
import { z } from "zod";
import { calculatePackage } from "@/lib/pricing";

const inputSchema = z.object({
  package: z.string().min(1).max(80),
  term_months: z.number().int().positive(),
  users: z.number().int().nonnegative(),
  endpoints: z.number().int().nonnegative(),
});

export async function POST(request: Request) {
  if (Number(request.headers.get("content-length") ?? 0) > 10_000) return NextResponse.json({ error: { code: "request_too_large", detail: "Request too large." } }, { status: 413 });
  const input = inputSchema.safeParse(await request.json().catch(() => null));
  if (!input.success) return NextResponse.json({ error: { code: "invalid_request", detail: input.error.flatten() } }, { status: 400 });
  const payload = await getPayload({ config });
  const packages = await payload.find({ collection: "packages", limit: 100, sort: "order", overrideAccess: true });
  try {
    return NextResponse.json({ data: calculatePackage(packages.docs, input.data.package, input.data.term_months, input.data.users, input.data.endpoints) });
  } catch (error) {
    return NextResponse.json({ error: { code: "validation_error", detail: error instanceof Error ? error.message : "Invalid request." } }, { status: 400 });
  }
}
