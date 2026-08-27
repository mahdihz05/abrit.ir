import { describe, expectTypeOf, test } from "vitest";
import type { FixedRoleKey, SessionUser } from "./types";

describe("Admin API role contracts", () => {
  test("models all assignable fixed roles and nullable session roles", () => {
    expectTypeOf<FixedRoleKey>().toEqualTypeOf<
      "editor" | "publisher" | "submission-reviewer" | "auditor"
    >();
    expectTypeOf<SessionUser["role"]>().toEqualTypeOf<
      { key: FixedRoleKey; name: string } | null
    >();
  });
});
