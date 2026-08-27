/** Shared Phase 1 Admin API contracts. Endpoint-specific clients arrive in later tasks. */
export type FixedRoleKey = "editor" | "publisher" | "submission-reviewer" | "auditor";

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
  results: AdminUser[];
  count: number;
}
