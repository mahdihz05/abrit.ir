import type { CollectionConfig } from "payload";
import { authenticated } from "../access";

export const Users: CollectionConfig = {
  slug: "users",
  auth: { maxLoginAttempts: 5, lockTime: 15 * 60 * 1000 },
  admin: { useAsTitle: "email", group: "Administration" },
  access: { create: authenticated, delete: authenticated, read: authenticated, update: authenticated },
  fields: [{ name: "name", type: "text", required: true, maxLength: 120 }],
};
