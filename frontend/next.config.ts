import type { NextConfig } from "next";
import path from "node:path";

for (const [name, fallback] of [
  ["NEXT_PUBLIC_SITE_URL", "http://localhost:3000"],
  ["NEXT_PUBLIC_API_URL", "http://localhost:8000/api/v1"],
] as const) {
  const value = process.env[name] ?? fallback;
  const parsed = new URL(value);
  if (!["http:", "https:"].includes(parsed.protocol)) throw new Error(`${name} must use http or https.`);
}

const nextConfig: NextConfig = {
  allowedDevOrigins: ["localhost", "127.0.0.1"],
  output: "standalone",
  outputFileTracingRoot: path.join(process.cwd(), ".."),
  outputFileTracingIncludes: {
    "/[locale]": ["../abrit-homepage-polished-v5.html"],
  },
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
