import { axe } from "jest-axe";
import { render, screen } from "@testing-library/react";
import { beforeEach, expect, test, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { AdminShell } from "./admin-shell";

vi.mock("next/navigation", () => ({ usePathname: () => "/admin" }));

beforeEach(() => { vi.restoreAllMocks(); });

test("renders an accessible isolated shell with filtered navigation", async () => {
  const { container } = render(<AdminShell user={{ id: 2, username: "editor", email: "", first_name: "کاربر", last_name: "آزمایشی", is_superuser: false, role: null, permissions: ["accounts.view_dashboard", "content.view_contentitem"] }}><h1>داشبورد</h1></AdminShell>);
  expect(screen.getByRole("main")).toBeInTheDocument();
  expect(screen.getByRole("navigation", { name: "فضای کاری" }).querySelector('a[href="/admin/content"]')).toBeInTheDocument();
  expect(screen.queryByRole("link", { name: /کاربران/ })).not.toBeInTheDocument();
  expect((await axe(container)).violations).toHaveLength(0);
});

test("opens and closes the mobile drawer with keyboard focus restoration", async () => {
  const user = userEvent.setup();
  render(<AdminShell><h1>داشبورد</h1></AdminShell>);
  const menu = screen.getByRole("button", { name: "باز کردن منوی مدیریت" });
  await user.click(menu);
  expect(screen.getByRole("complementary")).toHaveAttribute("data-open", "true");
  await user.keyboard("{Escape}");
  expect(screen.getByRole("complementary")).toHaveAttribute("data-open", "false");
  expect(menu).toHaveFocus();
});

test.each(["loading", "denied"] as const)("renders the %s state", (state) => {
  render(<AdminShell state={state}><h1>hidden</h1></AdminShell>);
  expect(screen.getByText(state === "loading" ? "در حال آماده‌سازی پنل" : "دسترسی به این بخش ممکن نیست")).toBeVisible();
  expect(screen.queryByText("hidden")).not.toBeInTheDocument();
});
