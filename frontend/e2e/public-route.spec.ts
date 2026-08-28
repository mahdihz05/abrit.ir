import { expect, test } from "@playwright/test";

test("the root route redirects to the default public locale", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveURL(/\/fa$/);
  await expect(page.locator("body")).toBeVisible();
});

for (const locale of ["fa", "en", "ar-ae"]) {
  test(`public ${locale} route remains rendered and accessible`, async ({ page }) => {
    await page.goto(`/${locale}`);
    await expect(page.locator("body")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator("html")).toHaveJSProperty("scrollWidth", await page.evaluate(() => window.innerWidth));
  });
}
