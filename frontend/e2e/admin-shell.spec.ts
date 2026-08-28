import { expect, test } from "@playwright/test";

for (const viewport of [
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 900 },
]) {
  test(`admin login is isolated, indexed off, and responsive at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login\?next=%2Fadmin$/);
    await expect(page.locator(".site-header, .site-footer")).toHaveCount(0);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await expect(page.getByRole("heading", { name: "ورود به پنل مدیریت" })).toBeVisible();
    await expect(page.getByRole("button", { name: "ورود" })).toBeVisible();
    await expect(page.locator("html")).toHaveJSProperty("scrollWidth", viewport.width);
  });
}
