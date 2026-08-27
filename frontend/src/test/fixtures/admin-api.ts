import type { AdminApiError, AdminApiSuccess, AdminSession, AdminUserList, AuditPage, DashboardData, PermissionDefinition, RoleDefinition } from "@/lib/admin-api/types";

export const adminSessionSuccess: AdminApiSuccess<AdminSession> = {
  data: {
    user: {
      id: 1,
      username: "site-admin",
      email: "admin@example.test",
      first_name: "Site",
      last_name: "Administrator",
      is_superuser: true,
      role: null,
      permissions: [],
    },
  },
};

export const adminUsersSuccess: AdminApiSuccess<AdminUserList> = {
  data: {
    meta: { page: 1, page_size: 20, total: 1, total_pages: 1 },
    data: [
      {
        id: 1,
        username: "site-admin",
        email: "admin@example.test",
        first_name: "Site",
        last_name: "Administrator",
        is_active: true,
        is_superuser: true,
        role: null,
        is_locked: false,
        locked_until: null,
        last_login: "2026-08-26T08:00:00Z",
        date_joined: "2026-01-01T00:00:00Z",
      },
    ],
  },
};

export const adminDashboardSuccess: AdminApiSuccess<DashboardData> = {
  data: {
    generated_at: "2026-08-26T08:00:00Z",
    users: { total: 1, active: 1, locked: 0 },
    content: { draft: 0, review: 0, scheduled: 0, published: 0, archived: 0 },
    submissions: { new: 0 },
    revalidation: { pending: 0, failed: 0 },
  },
};

export const adminRolesSuccess: AdminApiSuccess<RoleDefinition[]> = { data: [] };
export const adminPermissionsSuccess: AdminApiSuccess<PermissionDefinition[]> = { data: [] };
export const adminAuditSuccess: AdminApiSuccess<AuditPage> = {
  data: { data: [], meta: { page: 1, page_size: 20, total: 0, total_pages: 0 } },
};

export const adminApiErrors = {
  authenticationRequired: {
    error: { status: 401, code: "authentication_required", detail: "Authentication is required." },
  },
  permissionDenied: {
    error: { status: 403, code: "permission_denied", detail: "You do not have permission to perform this action." },
  },
  accountLocked: {
    error: { status: 401, code: "account_locked", detail: "Unable to sign in with the provided credentials." },
  },
  rateLimited: {
    error: { status: 429, code: "rate_limited", detail: "Too many requests. Please try again later." },
  },
} as const satisfies Record<string, AdminApiError>;
