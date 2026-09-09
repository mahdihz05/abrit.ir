import type { CollectionConfig } from "payload";
import { adminOnly, adminOrBootstrap } from "@/payload/access";

export const Users: CollectionConfig = {
  slug: "users",
  auth: { maxLoginAttempts: 5, lockTime: 15 * 60 * 1000 },
  admin: { useAsTitle: "email", defaultColumns: ["email", "roles", "updatedAt"] },
  access: { create: adminOrBootstrap, delete: adminOnly, read: adminOnly, update: adminOnly },
  fields: [
    {
      name: "roles",
      type: "select",
      hasMany: true,
      required: true,
      defaultValue: ["viewer"],
      options: ["admin", "editor", "seo", "form-manager", "pricing-manager", "viewer"],
      saveToJWT: true,
    },
  ],
};
