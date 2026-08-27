import type { AdminApiError, AdminApiSuccess } from "@/lib/admin-api/types";

export function jsonResponse<T>(body: AdminApiSuccess<T> | AdminApiError, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}
