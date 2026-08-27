import { expect, test } from "@playwright/test";

test("the root route redirects to the default public locale", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveURL(/\/fa$/);
  await expect(page.locator("body")).toBeVisible();
});
