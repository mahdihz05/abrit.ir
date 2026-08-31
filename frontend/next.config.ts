import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";
import path from "node:path";

for (const [name, fallback] of [["NEXT_PUBLIC_SITE_URL", "http://localhost:3000"]] as const) {
  const value = process.env[name] ?? fallback;
  const parsed = new URL(value);
  if (!["http:", "https:"].includes(parsed.protocol)) throw new Error(`${name} must use http or https.`);
}

const nextConfig: NextConfig = {
  allowedDevOrigins: ["localhost", "127.0.0.1"],
  output: "standalone",
  outputFileTracingRoot: path.join(process.cwd(), ".."),
  poweredByHeader: false,
  reactStrictMode: true,
};

export default withPayload(nextConfig);
