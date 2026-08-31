import { spawnSync } from "node:child_process";
import path from "node:path";

export type SnapshotRow = Record<string, unknown>;
export type DjangoSnapshot = { source: string; tables: Record<string, SnapshotRow[]> };

export function readDjangoSnapshot() {
  const database = process.env.DJANGO_SQLITE_PATH;
  if (!database) throw new Error("DJANGO_SQLITE_PATH must point to the source SQLite database.");
  const script = path.resolve(process.cwd(), "../scripts/export-django-snapshot.py");
  const command = process.env.PYTHON_COMMAND || "python";
  const result = spawnSync(command, [script, database], { encoding: "utf8", maxBuffer: 50 * 1024 * 1024, env: { ...process.env, PYTHONIOENCODING: "utf-8" } });
  if (result.status !== 0) throw new Error(result.stderr || `Snapshot export failed with exit code ${result.status}.`);
  return JSON.parse(result.stdout) as DjangoSnapshot;
}

export const text = (value: unknown) => value === null || value === undefined ? "" : String(value);
export const number = (value: unknown) => Number(value ?? 0);
export const bool = (value: unknown) => Boolean(number(value));
export const json = <T>(value: unknown, fallback: T): T => {
  if (typeof value !== "string" || !value) return fallback;
  try { return JSON.parse(value) as T; } catch { return fallback; }
};
