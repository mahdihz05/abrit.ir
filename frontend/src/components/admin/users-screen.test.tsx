import { axe } from "jest-axe";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, expect, test, vi } from "vitest";
import { AdminApiRequestError, createAdminUser, getAdminUsers, setAdminUserActive } from "@/lib/admin-api/client";
import type { AdminUserList } from "@/lib/admin-api/types";
import { UsersScreen } from "./users-screen";

vi.mock("@/lib/admin-api/client", async () => {
  const actual = await vi.importActual<typeof import("@/lib/admin-api/client")>("@/lib/admin-api/client");
  return { ...actual, getAdminUsers: vi.fn(), createAdminUser: vi.fn(), updateAdminUser: vi.fn(), changeAdminUserPassword: vi.fn(), setAdminUserActive: vi.fn() };
});

const user = { id: 2, username: "editor", email: "editor@example.test", first_name: "مینا", last_name: "احمدی", is_active: true, is_superuser: false, role: { key: "editor" as const, name: "ویراستار" }, is_locked: false, locked_until: null, last_login: null, date_joined: "2026-01-01T00:00:00Z" };
const page: AdminUserList = { data: [user], meta: { page: 1, page_size: 20, total: 1, total_pages: 1 } };

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(getAdminUsers).mockResolvedValue(page);
  vi.mocked(createAdminUser).mockResolvedValue(user);
  vi.mocked(setAdminUserActive).mockResolvedValue({ ...user, is_active: false });
});

test("renders the accessible user table and fixed role filter", async () => {
  const { container } = render(<UsersScreen />);
  expect(await screen.findByRole("table", { name: "فهرست کاربران مدیریت" })).toBeInTheDocument();
  expect(screen.getByText("مینا احمدی")).toBeInTheDocument();
  expect(screen.getByRole("option", { name: "بررسی‌کننده ارسال‌ها" })).toBeInTheDocument();
  expect((await axe(container)).violations).toHaveLength(0);
});

test("passes search, status, role, and page parameters to the R11 client", async () => {
  const userEventSetup = userEvent.setup();
  render(<UsersScreen />);
  await screen.findByText("مینا احمدی");
  await userEventSetup.type(screen.getByRole("textbox", { name: "جست‌وجوی کاربر" }), "مینا");
  fireEvent.change(screen.getByRole("combobox", { name: "فیلتر وضعیت" }), { target: { value: "inactive" } });
  fireEvent.change(screen.getByRole("combobox", { name: "فیلتر نقش" }), { target: { value: "editor" } });
  await waitFor(() => expect(getAdminUsers).toHaveBeenLastCalledWith(expect.objectContaining({ search: "مینا", status: "inactive", role: "editor", page: 1 })));
});

test("requires confirmation before deactivation and refreshes after confirmation", async () => {
  const userEventSetup = userEvent.setup();
  render(<UsersScreen />);
  await screen.findByText("مینا احمدی");
  await userEventSetup.click(screen.getByRole("button", { name: "غیرفعال‌سازی" }));
  expect(screen.getByRole("dialog", { name: "تأیید غیرفعال‌سازی" })).toBeInTheDocument();
  expect(setAdminUserActive).not.toHaveBeenCalled();
  await userEventSetup.click(screen.getByRole("button", { name: "تأیید" }));
  await waitFor(() => expect(setAdminUserActive).toHaveBeenCalledWith(2, false));
});

test("does not retain a password after closing the password dialog", async () => {
  const userEventSetup = userEvent.setup();
  render(<UsersScreen />);
  await screen.findByText("مینا احمدی");
  await userEventSetup.click(screen.getByRole("button", { name: "گذرواژه" }));
  const password = screen.getByLabelText("گذرواژه");
  await userEventSetup.type(password, "SafePassword123!");
  await userEventSetup.click(screen.getByRole("button", { name: "بستن فرم" }));
  await userEventSetup.click(screen.getByRole("button", { name: "گذرواژه" }));
  expect(screen.getByLabelText("گذرواژه")).toHaveValue("");
});

test("renders API error state with a retry action", async () => {
  vi.mocked(getAdminUsers).mockRejectedValueOnce(new AdminApiRequestError({ status: 403, code: "permission_denied", detail: "denied" }));
  render(<UsersScreen />);
  expect(await screen.findByRole("alert")).toHaveTextContent("فقط ابرکاربر");
  expect(screen.getByRole("button", { name: "تلاش دوباره" })).toBeInTheDocument();
});
