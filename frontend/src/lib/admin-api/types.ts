/** Shared Phase 1 Admin API contracts. Keep these aligned with backend/schema.yml. */
export type FixedRoleKey = "editor" | "publisher" | "submission-reviewer" | "auditor";
export type AdminLocale = "fa" | "en" | "ar-ae";
export type AuditActorType = "admin" | "api" | "system" | "mcp" | "agent";
export type AuditAction =
  | "publish" | "unpublish" | "restore" | "retention_purge"
  | "user_create" | "user_update" | "user_activate" | "user_deactivate"
  | "user_password_reset" | "user_role_change" | "auth_login_success"
  | "auth_login_failure" | "auth_logout";

export interface FixedRoleReference {
  key: FixedRoleKey;
  name: string;
}

export interface AdminApiSuccess<T> {
  data: T;
}

export interface AdminApiError {
  error: {
    status: number;
    code: string;
    /** DRF returns a string or a structured validation payload here. */
    detail: string | Record<string, string[]>;
  };
}

export interface SessionUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_superuser: boolean;
  /** Superusers and legacy accounts need not have one of the fixed roles. */
  role: FixedRoleReference | null;
  permissions: string[];
}

export interface AdminSession {
  user: SessionUser;
}

/** User-management endpoints are superuser-only; no conditional fields are modeled. */
export interface AdminUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_superuser: boolean;
  role: FixedRoleReference | null;
  is_locked: boolean;
  locked_until: string | null;
  last_login: string | null;
  date_joined: string;
}

export interface AdminUserList {
  data: AdminUser[];
  meta: { page: number; page_size: number; total: number; total_pages: number };
}

export interface DashboardData {
  generated_at: string;
  users: { total: number; active: number; locked: number };
  content: { draft: number; review: number; scheduled: number; published: number; archived: number };
  submissions: { new: number };
  revalidation: { pending: number; failed: number };
}

export interface RoleDefinition {
  key: FixedRoleKey;
  name: string;
  description: string;
  reserved: boolean;
  requires_django_staff: boolean;
  permissions: string[];
}

export interface PermissionDefinition {
  key: string;
  label: string;
  category: string;
  source: "custom" | "django";
}

export interface AuditActor { id: number; username: string }
export interface AuditSummary {
  id: string;
  timestamp: string;
  actor: AuditActor | null;
  actor_type: AuditActorType;
  action: AuditAction;
  object_type: string;
  object_id: string;
}
export interface AuditDetail extends AuditSummary {
  before: unknown;
  after: unknown;
  metadata: unknown;
}
export interface AuditPage {
  data: AuditSummary[];
  meta: { page: number; page_size: number; total: number; total_pages: number };
}
