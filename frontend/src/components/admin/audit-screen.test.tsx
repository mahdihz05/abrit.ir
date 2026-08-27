import { axe } from "jest-axe";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, expect, test, vi } from "vitest";
import { AuditScreen } from "./audit-screen";
import { AdminApiRequestError, getAdminAudit, getAdminAuditDetail } from "@/lib/admin-api/client";

const replace = vi.fn();
const audit = vi.mocked(getAdminAudit);
const detail = vi.mocked(getAdminAuditDetail);
let query = "";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
  usePathname: () => "/admin/audit",
  useSearchParams: () => new URLSearchParams(query),
}));
vi.mock("@/lib/admin-api/client", async () => {
  const actual = await vi.importActual<typeof import("@/lib/admin-api/client")>("@/lib/admin-api/client");
  return { ...actual, getAdminAudit: vi.fn(), getAdminAuditDetail: vi.fn() };
});

beforeEach(() => {
  query = "";
  replace.mockReset();
  audit.mockResolvedValue({ data: [{ id: "a1", timestamp: "2026-08-26T08:00:00Z", actor: { id: 1, username: "<admin>" }, actor_type: "admin", action: "user_update", object_type: "user", object_id: "7" }], meta: { page: 1, page_size: 20, total: 1, total_pages: 1 } });
  detail.mockResolvedValue({ id: "a1", timestamp: "2026-08-26T08:00:00Z", actor: { id: 1, username: "<admin>" }, actor_type: "admin", action: "user_update", object_type: "user", object_id: "7", before: { html: "<script>alert(1)</script>" }, after: null, metadata: { safe: true } });
});

test("renders an accessible read-only audit table and safely displays JSON detail", async () => {
  const user = userEvent.setup();
  const { container } = render(<AuditScreen />);
  expect(await screen.findByText("user_update")).toBeVisible();
  expect(screen.queryByText("<script>alert(1)</script>")).not.toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "مشاهده جزئیات" }));
  expect(await screen.findByText(/<script>alert\(1\)<\/script>/)).toBeVisible();
  expect(screen.queryByRole("button", { name: /export|خروجی/i })).not.toBeInTheDocument();
  expect((await axe(container)).violations).toHaveLength(0);
});

test("normalizes filters and pagination into a deterministic URL query", async () => {
  const user = userEvent.setup();
  query = "action=publish&page=2&ordering=timestamp";
  render(<AuditScreen />);
  await waitFor(() => expect(screen.getByDisplayValue("publish")).toBeInTheDocument());
  await user.selectOptions(screen.getByLabelText("ترتیب"), "-timestamp");
  await user.click(screen.getByRole("button", { name: "اعمال فیلتر" }));
  expect(replace).toHaveBeenCalledWith("/admin/audit?action=publish&ordering=-timestamp&page=1&page_size=20");
});

test("shows empty and denied API states", async () => {
  audit.mockResolvedValueOnce({ data: [], meta: { page: 1, page_size: 20, total: 0, total_pages: 0 } });
  render(<AuditScreen />);
  expect(await screen.findByText("رویدادی پیدا نشد")).toBeVisible();
  audit.mockRejectedValueOnce(new AdminApiRequestError({ status: 403, code: "permission_denied", detail: "No" }));
  query = "action=publish";
  render(<AuditScreen />);
  expect(await screen.findByText("دسترسی به گزارش رویدادها ممکن نیست")).toBeVisible();
});
