import config from "@payload-config";
import { NotFoundPage } from "@payloadcms/next/views";
import { importMap } from "../importMap";

export default function PayloadNotFound() {
  return NotFoundPage({ config, importMap, params: Promise.resolve({ segments: [] as string[] }), searchParams: Promise.resolve({} as Record<string, string | string[]>) });
}
