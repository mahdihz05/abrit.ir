import { NextResponse } from "next/server";

const backendApi = (
  process.env.BACKEND_API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://127.0.0.1:8000/api/v1"
).replace(/\/$/, "");

const locales = new Set(["fa", "en", "ar-ae"]);
const dataFields = [
  "full_name",
  "phone",
  "email",
  "company",
  "company_size",
  "need_type",
  "details",
  "preferred_contact",
  "context",
] as const;

function safeReturnPath(value: FormDataEntryValue | null) {
  if (
    typeof value !== "string" ||
    !value.startsWith("/") ||
    value.startsWith("//")
  ) {
    return "/fa/independent-services";
  }
  return value.split(/[?#]/, 1)[0];
}

function redirectToForm(
  request: Request,
  path: string,
  status: "success" | "error",
) {
  return NextResponse.redirect(
    new URL(`${path}#consultation-${status}`, request.url),
    303,
  );
}

export async function POST(request: Request) {
  const values = await request.formData();
  const returnPath = safeReturnPath(values.get("return_to"));
  const localeValue = values.get("locale");
  const locale =
    typeof localeValue === "string" && locales.has(localeValue)
      ? localeValue
      : "fa";

  const data: Record<string, string> = {};
  for (const field of dataFields) {
    const value = values.get(field);
    if (typeof value === "string" && value.trim()) data[field] = value.trim();
  }

  try {
    const response = await fetch(
      `${backendApi}/forms/consultation/submissions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          locale,
          data,
          consent_given: values.get("consent_given") === "yes",
          website: values.get("website") ?? "",
          source_url: new URL(returnPath, request.url).toString(),
          referrer: request.headers.get("referer") ?? "",
        }),
        cache: "no-store",
      },
    );

    if (!response.ok) return redirectToForm(request, returnPath, "error");
    return redirectToForm(request, returnPath, "success");
  } catch {
    return redirectToForm(request, returnPath, "error");
  }
}
