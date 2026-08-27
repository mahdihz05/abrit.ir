import { describe, expect, test } from "vitest";
import { adminNavigationRegistry, filterAdminNavigation } from "./navigation";

describe("admin navigation registry", () => {
  test("filters protected entries by permission while retaining overview", () => {
    expect(filterAdminNavigation(adminNavigationRegistry, ["accounts.view_dashboard", "content.view_contentitem"]).map((item) => item.id)).toEqual(["overview", "content"]);
  });
  test("allows superusers to see every registered entry", () => {
    expect(filterAdminNavigation(adminNavigationRegistry, [], true)).toHaveLength(adminNavigationRegistry.length);
  });
});
