import { expect, test } from "@playwright/test";

for (const viewport of [
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 900 },
]) {
  test(`admin is isolated, indexed off, and responsive at ${viewport.name}`, async ({ page }) => {
  await page.setViewportSize(viewport);
  await page.goto("/admin");
  await expect(page.locator("main")).toBeVisible();
  await expect(page.locator(".site-header, .site-footer")).toHaveCount(0);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await page.getByRole("button", { name: "باز کردن منوی مدیریت" }).click();
  await expect(page.getByRole("complementary")).toHaveAttribute("data-open", "true");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("complementary")).toHaveAttribute("data-open", "false");
  await expect(page.locator("main")).toHaveJSProperty("scrollWidth", viewport.width);
  });
}
