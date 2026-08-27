import { expect, test } from "@playwright/test";

test("admin is isolated, indexed off, and responsive", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/admin");
  await expect(page.locator("main")).toBeVisible();
  await expect(page.locator(".site-header, .site-footer")).toHaveCount(0);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await page.getByRole("button", { name: "باز کردن منوی مدیریت" }).click();
  await expect(page.getByRole("complementary")).toHaveAttribute("data-open", "true");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("complementary")).toHaveAttribute("data-open", "false");
});
