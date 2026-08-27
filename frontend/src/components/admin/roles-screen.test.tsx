import { axe } from "jest-axe";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { AdminApiRequestError, getAdminPermissions, getAdminRole, getAdminRoles } from "@/lib/admin-api/client";
import { RolesScreen } from "./roles-screen";

vi.mock("@/lib/admin-api/client", async () => {
  const actual = await vi.importActual<typeof import("@/lib/admin-api/client")>("@/lib/admin-api/client");
  return { ...actual, getAdminPermissions: vi.fn(), getAdminRole: vi.fn(), getAdminRoles: vi.fn() };
});

const roles = [
  { key: "editor" as const, name: "Editor", description: "Edit content.", reserved: true, requires_django_staff: true, permissions: ["content.change_contentitem", "accounts.view_role_catalog"] },
  { key: "auditor" as const, name: "Auditor", description: "Read audit information.", reserved: true, requires_django_staff: false, permissions: ["core.view_auditlog"] },
];
const permissions = [
  { key: "content.change_contentitem", label: "Can change content", category: "content" as const, source: "django" as const },
  { key: "accounts.view_role_catalog", label: "Can view role catalog", category: "accounts" as const, source: "custom" as const },
  { key: "core.view_auditlog", label: "Can view audit log", category: "core" as const, source: "django" as const },
];

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(getAdminRoles).mockResolvedValue(roles);
  vi.mocked(getAdminPermissions).mockResolvedValue(permissions);
  vi.mocked(getAdminRole).mockImplementation(async (key) => roles.find((role) => role.key === key)!);
});

describe("RolesScreen", () => {
  test("renders the selected role, categorized permissions, and immutable guidance accessibly", async () => {
    const { container } = render(<RolesScreen />);

    expect(screen.getByText("فهرست نقش‌ها و مجوزهای سیستم در حال آماده‌سازی است.")).toBeVisible();
    expect(await screen.findByRole("heading", { name: "ویرایشگر" })).toBeVisible();
    expect(screen.getByText("نقش‌های رزروشده و تغییرناپذیر")).toBeVisible();
    expect(screen.getByRole("heading", { name: "محتوا" })).toBeVisible();
    expect(screen.getByText("Can change content")).toBeVisible();
    expect(screen.getByText("بله")).toBeVisible();
    expect((await axe(container)).violations).toHaveLength(0);
  });

  test("searches roles and permissions and switches detail without edit controls", async () => {
    const user = userEvent.setup();
    render(<RolesScreen />);
    await screen.findByRole("heading", { name: "ویرایشگر" });

    const search = screen.getByRole("searchbox", { name: "جستجو در نقش‌ها و دسترسی‌ها" });
    await user.clear(search);
    await user.type(search, "audit");
    expect(screen.getByRole("button", { name: /حسابرسی‌کننده/ })).toBeVisible();
    expect(screen.queryByRole("button", { name: /ویرایشگر/ })).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /حسابرسی‌کننده/ }));
    expect(await screen.findByRole("heading", { name: "حسابرسی‌کننده" })).toBeVisible();
    expect(screen.getByText("Can view audit log")).toBeVisible();
    expect(screen.queryByRole("button", { name: /ذخیره|ویرایش|حذف/ })).not.toBeInTheDocument();
  });

  test.each(["denied", "error"] as const)("renders the %s API state", async (kind) => {
    if (kind === "denied") vi.mocked(getAdminRoles).mockRejectedValue(new AdminApiRequestError({ status: 403, code: "permission_denied", detail: "Denied" }));
    else vi.mocked(getAdminRoles).mockRejectedValue(new Error("Network unavailable"));
    render(<RolesScreen />);
    expect(await screen.findByRole("alert")).toBeVisible();
    expect(screen.getByRole("heading", { name: kind === "denied" ? "مشاهده نقش‌ها ممکن نیست" : "بارگذاری نقش‌ها ناموفق بود" })).toBeVisible();
    if (kind === "error") expect(screen.getByRole("button", { name: "تلاش دوباره" })).toBeVisible();
  });

  test("shows a clear empty result for an unmatched search", async () => {
    render(<RolesScreen />);
    await waitFor(() => expect(screen.getByRole("heading", { name: "ویرایشگر" })).toBeVisible());
    const search = screen.getByRole("searchbox");
    await userEvent.setup().type(search, "missing");
    expect(screen.getByText("نقشی با این جستجو پیدا نشد.")).toBeVisible();
  });
});
