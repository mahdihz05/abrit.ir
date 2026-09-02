import { extractReferenceStyle, readReferenceHomepage } from "@/lib/reference-homepage";

export const dynamic = "force-static";

export async function GET() {
  return new Response(extractReferenceStyle(await readReferenceHomepage()), {
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Type": "text/css; charset=utf-8",
    },
  });
}
