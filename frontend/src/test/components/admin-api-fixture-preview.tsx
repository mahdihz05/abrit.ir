import type { AdminApiError, AdminApiSuccess } from "@/lib/admin-api/types";

interface AdminApiFixturePreviewProps {
  response: AdminApiSuccess<{ user: { username: string } }> | AdminApiError;
}

export function AdminApiFixturePreview({ response }: AdminApiFixturePreviewProps) {
  if ("error" in response) {
    return <p role="alert">{typeof response.error.detail === "string" ? response.error.detail : "Request failed."}</p>;
  }

  return <p>Signed in as {response.data.user.username}</p>;
}
