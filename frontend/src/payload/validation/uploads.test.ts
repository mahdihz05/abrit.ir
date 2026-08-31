import JSZip from "jszip";
import { describe, expect, it } from "vitest";
import type { CollectionBeforeValidateHook } from "payload";
import { validatePrivateUpload } from "./uploads";

type HookArguments = Parameters<CollectionBeforeValidateHook>[0];

async function validate(name: string, mimetype: string, data: Buffer) {
  return validatePrivateUpload({ data: {}, req: { file: { name, mimetype, data, size: data.byteLength } } } as HookArguments);
}

describe("private submission upload validation", () => {
  it("rejects executable extensions", async () => {
    await expect(validate("payload.exe", "application/octet-stream", Buffer.from("MZ"))).rejects.toThrow("not allowed");
  });

  it("rejects extension spoofing", async () => {
    await expect(validate("spoofed.pdf", "application/pdf", Buffer.from("MZ-not-a-pdf"))).rejects.toThrow("signature");
  });

  it("rejects a mismatched declared MIME type", async () => {
    await expect(validate("document.pdf", "image/png", Buffer.from("%PDF-1.7"))).rejects.toThrow("declared MIME");
  });

  it("accepts a structurally valid DOCX container and records metadata", async () => {
    const archive = new JSZip();
    archive.file("[Content_Types].xml", "<Types/>");
    archive.file("word/document.xml", "<document/>");
    const data = await archive.generateAsync({ type: "nodebuffer" });
    const result = await validate("safe.docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", data);
    expect(result).toMatchObject({ originalName: "safe.docx", size: data.byteLength });
    expect((result as { checksumSHA256: string }).checksumSHA256).toHaveLength(64);
  });
});
