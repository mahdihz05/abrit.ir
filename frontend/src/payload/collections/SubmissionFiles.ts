import type { CollectionConfig } from "payload";
import { authenticated } from "../access";
import { validatePrivateUpload } from "../validation/uploads";

export const SubmissionFiles: CollectionConfig = {
  slug: "submission-files",
  admin: { group: "Forms", useAsTitle: "originalName" },
  access: { create: () => false, delete: authenticated, read: authenticated, update: authenticated },
  upload: { staticDir: "private-media/form-submissions", disableLocalStorage: false },
  hooks: { beforeValidate: [validatePrivateUpload] },
  fields: [
    { name: "legacyID", type: "text", unique: true, index: true, admin: { hidden: true } },
    { name: "submission", type: "relationship", relationTo: "form-submissions", required: true, index: true },
    { name: "originalName", type: "text", required: true },
    { name: "mimeType", type: "text", required: true },
    { name: "size", type: "number", required: true },
    { name: "checksumSHA256", type: "text", required: true },
  ],
};
