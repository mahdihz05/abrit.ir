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
  async rewrites() {
    const liveChatOrigin = "https://livechat.abrit.cloud";
    return {
      beforeFiles: [
        { source: "/livechat/:path*", destination: `${liveChatOrigin}/:path*` },
        { source: "/vite/:path*", destination: `${liveChatOrigin}/vite/:path*` },
        { source: "/brand-assets/:path*", destination: `${liveChatOrigin}/brand-assets/:path*` },
        { source: "/audio/:path*", destination: `${liveChatOrigin}/audio/:path*` },
        { source: "/api/v1/widget/:path*", destination: `${liveChatOrigin}/api/v1/widget/:path*` },
        { source: "/cable/:path*", destination: `${liveChatOrigin}/cable/:path*` },
        { source: "/hc/:path*", destination: `${liveChatOrigin}/hc/:path*` },
        { source: "/rails/active_storage/:path*", destination: `${liveChatOrigin}/rails/active_storage/:path*` },
        { source: "/uploads/:path*", destination: `${liveChatOrigin}/uploads/:path*` },
      ],
    };
  },
};

export default nextConfig;
