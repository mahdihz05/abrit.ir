import type { Access, GlobalConfig } from "payload";

export const authenticated: Access = ({ req }) => Boolean(req.user);

export const authenticatedGlobal: NonNullable<GlobalConfig["access"]>["read"] = ({ req }) => Boolean(req.user);

export const publishedOrAuthenticated: Access = ({ req }) => {
  if (req.user) return true;
  return { _status: { equals: "published" } };
};
