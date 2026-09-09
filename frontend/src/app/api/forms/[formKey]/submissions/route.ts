import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";

const allowedForms = new Set(["consultation", "quote-request"]);
const allowedLocales = new Set(["fa", "en", "ar-ae"]);

function hashIP(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",", 1)[0]?.trim() ?? request.headers.get("x-real-ip") ?? "unknown";
  return createHash("sha256").update(`${process.env.PAYLOAD_SECRET}:${ip}`).digest("hex");
}

export async function submitForm(request: Request, formKey: string) {
  if (!allowedForms.has(formKey)) return NextResponse.json({ error: { detail: "Form not found." } }, { status: 404 });
  if (Number(request.headers.get("content-length") ?? 0) > 10_000) return NextResponse.json({ error: { detail: "Request too large." } }, { status: 413 });

  let body: Record<string, unknown>;
  try {
    body = await request.json() as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: { detail: "Invalid JSON." } }, { status: 400 });
  }
  if (body.website) return NextResponse.json({ data: { message: "Submitted." } }, { status: 201 });
  if (body.consent_given !== true || !body.data || typeof body.data !== "object" || Array.isArray(body.data)) return NextResponse.json({ error: { detail: "Required fields are missing." } }, { status: 400 });

  const locale = typeof body.locale === "string" && allowedLocales.has(body.locale) ? body.locale : "fa";
  const data = Object.fromEntries(Object.entries(body.data).filter(([, value]) => typeof value === "string").map(([key, value]) => [key, String(value).trim().slice(0, 2_000)]));
  if (!data.full_name || !data.phone) return NextResponse.json({ error: { detail: "Required fields are missing." } }, { status: 400 });

  try {
    const payload = await getPayload({ config });
    await payload.create({ collection: "form-submissions", data: { formKey, data, consent: true, source: typeof body.source_url === "string" ? body.source_url.slice(0, 500) : "", ipHash: hashIP(request) } });
    const message = locale === "fa" ? "درخواست شما ثبت شد." : locale === "ar-ae" ? "تم تسجيل طلبك." : "Your request has been received.";
    return NextResponse.json({ data: { message } }, { status: 201 });
  } catch {
    return NextResponse.json({ error: { detail: "Unable to submit the form." } }, { status: 503 });
  }
}

export async function POST(request: Request, { params }: RouteContext<"/api/forms/[formKey]/submissions">) {
  const { formKey } = await params;
  return submitForm(request, formKey);
}
