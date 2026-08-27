import type { AdminApiError, AdminApiSuccess, AdminSession, AdminUser, AdminUserList, DashboardData, PermissionDefinition, RoleDefinition, AuditDetail, AuditPage } from "./types";

const apiBase = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1").replace(/\/$/, "");
let csrfToken: string | null = null;

export class AdminApiRequestError extends Error {
  status: number;
  code: string;
  detail: AdminApiError["error"]["detail"];

  constructor(error: AdminApiError["error"]) {
    super(typeof error.detail === "string" ? error.detail : "Request failed.");
    this.name = "AdminApiRequestError";
    this.status = error.status;
    this.code = error.code;
    this.detail = error.detail;
  }
}

async function request<T>(path: string, init: RequestInit = {}) {
  const method = (init.method ?? "GET").toUpperCase();
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  if (method !== "GET" && method !== "HEAD" && csrfToken) headers.set("X-CSRFToken", csrfToken);

  const response = await fetch(`${apiBase}${path}`, { ...init, credentials: "include", headers });
  const body = (await response.json()) as AdminApiSuccess<T> | AdminApiError;
  if (!response.ok || "error" in body) {
    throw new AdminApiRequestError((body as AdminApiError).error ?? { status: response.status, code: "request_error", detail: "Request failed." });
  }
  return body.data;
}

export async function bootstrapCsrf() {
  const data = await request<{ csrf_token: string }>("/admin/auth/csrf");
  csrfToken = data.csrf_token;
  return data.csrf_token;
}

export function getCsrfTokenForTesting() { return csrfToken; }

export async function getAdminSession() {
  return request<AdminSession>("/admin/auth/session");
}

export async function getAdminDashboard() {
  return request<DashboardData>("/admin/dashboard");
}

export async function loginAdmin(username: string, password: string) {
  const data = await request<AdminSession>("/admin/auth/login", { method: "POST", body: JSON.stringify({ username, password }) });
  await bootstrapCsrf();
  return data;
}

export async function logoutAdmin() {
  await request<null>("/admin/auth/logout", { method: "POST", body: "{}" });
  csrfToken = null;
}

<<<<<<< HEAD
export interface AdminUserQuery {
  page?: number;
  page_size?: number;
  search?: string;
  status?: "active" | "inactive";
  role?: string;
  ordering?: "username" | "-username" | "date_joined" | "-date_joined";
}

function queryString(query: AdminUserQuery) {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== "") params.set(key, String(value));
  });
  const result = params.toString();
  return result ? `?${result}` : "";
}

export function getAdminUsers(query: AdminUserQuery = {}) {
  return request<AdminUserList>(`/admin/users${queryString(query)}`);
}

export function createAdminUser(input: Record<string, unknown>) {
  return request<AdminUser>("/admin/users", { method: "POST", body: JSON.stringify(input) });
}

export function updateAdminUser(id: number, input: Record<string, unknown>) {
  return request<AdminUser>(`/admin/users/${id}`, { method: "PATCH", body: JSON.stringify(input) });
}

export function changeAdminUserPassword(id: number, password: string) {
  return request<{ changed: boolean }>(`/admin/users/${id}/password`, { method: "POST", body: JSON.stringify({ password }) });
}

export function setAdminUserActive(id: number, active: boolean) {
  return request<AdminUser>(`/admin/users/${id}/${active ? "activate" : "deactivate"}`, { method: "POST", body: "{}" });
}

export async function getAdminRoles() {
  return request<RoleDefinition[]>("/admin/roles");
}

export async function getAdminRole(key: RoleDefinition["key"]) {
  return request<RoleDefinition>(`/admin/roles/${encodeURIComponent(key)}`);
}

export async function getAdminPermissions() {
  return request<PermissionDefinition[]>("/admin/permissions");
=======
export async function getAdminAudit(query: string) {
  return request<AuditPage>(`/admin/audit${query ? `?${query}` : ""}`);
}

export async function getAdminAuditDetail(id: string) {
  return request<AuditDetail>(`/admin/audit/${encodeURIComponent(id)}`);
>>>>>>> feat/p1-r17-audit-screen
}
