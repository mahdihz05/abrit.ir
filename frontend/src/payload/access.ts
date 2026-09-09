import type { Access, FieldAccess } from "payload";

type Role = "admin" | "editor" | "seo" | "form-manager" | "pricing-manager" | "viewer";
type UserWithRoles = { roles?: Role[] } | undefined;

function hasRole(user: UserWithRoles, roles: readonly Role[]) {
  return Boolean(user?.roles?.some((role) => roles.includes(role)));
}

export const anyone: Access = () => true;
export const authenticated: Access = ({ req }) => Boolean(req.user);
export const adminOrBootstrap: Access = ({ req }) => !req.user || hasRole(req.user as UserWithRoles, ["admin"]);
export const contentEditor: Access = ({ req }) => hasRole(req.user as UserWithRoles, ["admin", "editor"]);
export const seoEditor: Access = ({ req }) => hasRole(req.user as UserWithRoles, ["admin", "seo"]);
export const pricingEditor: Access = ({ req }) => hasRole(req.user as UserWithRoles, ["admin", "pricing-manager"]);
export const formManager: Access = ({ req }) => hasRole(req.user as UserWithRoles, ["admin", "form-manager"]);
export const adminOnly: Access = ({ req }) => hasRole(req.user as UserWithRoles, ["admin"]);
export const adminFieldOnly: FieldAccess = ({ req }) => hasRole(req.user as UserWithRoles, ["admin"]);
