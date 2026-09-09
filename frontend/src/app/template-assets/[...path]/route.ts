import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

const assetsRoot = path.resolve(process.cwd(), "../techor-html-package/techor-placeholder/assets");
const contentTypes: Record<string, string> = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

export async function GET(_: Request, { params }: RouteContext<"/template-assets/[...path]">) {
  const { path: segments } = await params;
  const target = path.resolve(assetsRoot, ...segments);
  if (!target.startsWith(`${assetsRoot}${path.sep}`)) return new NextResponse(null, { status: 404 });

  try {
    const body = await readFile(target);
    return new NextResponse(body, {
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Type": contentTypes[path.extname(target).toLowerCase()] ?? "application/octet-stream",
      },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
