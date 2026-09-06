import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { readDjangoSnapshot, text } from "./django-snapshot";

type Asset = {
  relative_path: string;
  extension: string;
  size: number;
  sha256: string;
  categories: string[];
};

const legacyRoot = process.env.LEGACY_REPOSITORY_ROOT ?? "C:\\projects\\abrit.ir";
const outputPath = path.resolve(process.cwd(), "../artifacts/legacy-asset-inventory.json");
const publicRoots = ["frontend/public", "backend/media"];
const supportedExtensions = new Set([".avif", ".gif", ".ico", ".jpeg", ".jpg", ".pdf", ".png", ".svg", ".webp", ".mp4", ".webm"]);

async function filesUnder(directory: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(directory, { withFileTypes: true });
    const files = await Promise.all(entries.map(async (entry) => {
      const target = path.join(directory, entry.name);
      if (entry.isDirectory()) return filesUnder(target);
      return entry.isFile() ? [target] : [];
    }));
    return files.flat();
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

async function sha256(file: string) {
  return createHash("sha256").update(await fs.readFile(file)).digest("hex");
}

function normalized(value: string) {
  return value.replace(/\\/g, "/").replace(/^\/+/, "");
}

async function main() {
  const snapshot = readDjangoSnapshot();
  const mediaReferences = new Set((snapshot.tables.media_mediaasset ?? []).map((row) => normalized(text(row.file))).filter(Boolean));
  const assets = (await Promise.all(publicRoots.map(async (root) => Promise.all((await filesUnder(path.join(legacyRoot, root))).map(async (file) => {
    const relativePath = normalized(path.relative(legacyRoot, file));
    const extension = path.extname(file).toLowerCase();
    const referencePath = normalized(path.relative(path.join(legacyRoot, "backend/media"), file));
    const categories = [
      referencePath && mediaReferences.has(referencePath) ? "represented" : "filesystem-only",
      supportedExtensions.has(extension) ? "supported-type" : "unsupported-type",
    ];
    if (relativePath.startsWith("frontend/public/media/homepage/")) categories.push("homepage");
    return { relative_path: relativePath, extension, size: (await fs.stat(file)).size, sha256: await sha256(file), categories } satisfies Asset;
  }))))).flat().sort((left, right) => left.relative_path.localeCompare(right.relative_path));

  const presentReferences = new Set(assets.filter((asset) => asset.categories.includes("represented")).map((asset) => normalized(path.relative("backend/media", asset.relative_path))));
  const missingReferences = [...mediaReferences].filter((reference) => !presentReferences.has(reference)).sort();
  const duplicateHashes = new Set([...assets.reduce((groups, asset) => groups.set(asset.sha256, [...(groups.get(asset.sha256) ?? []), asset]), new Map<string, Asset[]>()).entries()].filter(([, group]) => group.length > 1).map(([hash]) => hash));
  for (const asset of assets) if (duplicateHashes.has(asset.sha256)) asset.categories.push("duplicate-content");

  const inventory = {
    assets,
    db_reference_missing_file: missingReferences,
    summary: {
      assets: assets.length,
      represented: assets.filter((asset) => asset.categories.includes("represented")).length,
      filesystem_only: assets.filter((asset) => asset.categories.includes("filesystem-only")).length,
      db_reference_missing_file: missingReferences.length,
      duplicate_content: assets.filter((asset) => asset.categories.includes("duplicate-content")).length,
      unsupported_type: assets.filter((asset) => asset.categories.includes("unsupported-type")).length,
    },
  };

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, `${JSON.stringify(inventory, null, 2)}\n`);
  console.log(JSON.stringify(inventory.summary));
}

await main();
