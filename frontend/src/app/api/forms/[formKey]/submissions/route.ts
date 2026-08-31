import config from "@payload-config";
import { getPayload } from "payload";
import { NextResponse } from "next/server";
import { z } from "zod";
import { hashIPAddress, validateSubmission } from "@/lib/forms";

const requestSchema = z.object({
  locale: z.enum(["fa", "en", "ar-ae"]),
  data: z.record(z.string(), z.unknown()),
  consent_given: z.boolean(),
  source_url: z.string().url().max(500).optional().or(z.literal("")),
  referrer: z.string().url().max(500).optional().or(z.literal("")),
  website: z.string().max(500).optional(),
});

function clientIP(request: Request) {
  return (request.headers.get("x-forwarded-for")?.split(",")[0] ?? request.headers.get("x-real-ip") ?? "").trim();
}

export async function POST(request: Request, { params }: { params: Promise<{ formKey: string }> }) {
  if (Number(request.headers.get("content-length") ?? 0) > 25_000) return NextResponse.json({ error: { code: "request_too_large", detail: "Request too large." } }, { status: 413 });
  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: { code: "invalid_request", detail: parsed.error.flatten() } }, { status: 400 });
  const { formKey } = await params;
  const payload = await getPayload({ config });
  const forms = await payload.find({ collection: "forms", locale: parsed.data.locale, fallbackLocale: false, limit: 1, overrideAccess: true, where: { key: { equals: formKey } } });
  const form = forms.docs[0];
  if (!form?.isActive) return NextResponse.json({ error: { code: "not_found", detail: "This form is not available." } }, { status: 404 });

  const address = clientIP(request);
  const ipHash = address ? hashIPAddress(address) : "";
  if (ipHash) {
    const recent = await payload.count({ collection: "form-submissions", overrideAccess: true, where: { and: [{ ipHash: { equals: ipHash } }, { createdAt: { greater_than: new Date(Date.now() - 3_600_000).toISOString() } }] } });
    if (recent.totalDocs >= 10) return NextResponse.json({ error: { code: "throttled", detail: "Too many submissions." } }, { status: 429 });
  }

  try {
    const cleaned = validateSubmission(form, parsed.data);
    const submission = await payload.create({
      collection: "form-submissions", overrideAccess: true,
      data: {
        form: form.id, locale: parsed.data.locale, data: cleaned, status: "new",
        sourceURL: parsed.data.source_url ?? "", referrer: parsed.data.referrer ?? "",
        consentGiven: parsed.data.consent_given, consentText: form.consentLabel ?? "",
        userAgent: (request.headers.get("user-agent") ?? "").slice(0, 500), ipHash,
        expiresAt: new Date(Date.now() + form.retentionMonths * 30 * 86_400_000).toISOString(),
      },
    });
    return NextResponse.json({ data: { id: submission.id, message: form.successMessage } }, { status: 201 });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "invalid";
    const status = detail === "honeypot" ? 400 : detail === "inactive" ? 404 : 400;
    return NextResponse.json({ error: { code: "validation_error", detail } }, { status });
  }
}
