import { axe } from "jest-axe";
import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, expect, test, vi } from "vitest";
import { getAdminDashboard } from "@/lib/admin-api/client";
import { adminDashboardSuccess } from "@/test/fixtures/admin-api";
import { AdminDashboard, StateMessage } from "./dashboard";

vi.mock("@/lib/admin-api/client", async () => {
  const actual = await vi.importActual<typeof import("@/lib/admin-api/client")>("@/lib/admin-api/client");
  return { ...actual, getAdminDashboard: vi.fn() };
});

const dashboard = vi.mocked(getAdminDashboard);

beforeEach(() => dashboard.mockReset());

test("announces the loading state while the dashboard request is pending", async () => {
  let resolvePending!: (data: Awaited<ReturnType<typeof getAdminDashboard>>) => void;
  const pending = new Promise<Awaited<ReturnType<typeof getAdminDashboard>>>((resolve) => { resolvePending = resolve; });
  dashboard.mockReturnValue(pending);
  render(<AdminDashboard />);
  expect(screen.getByText("در حال آماده‌سازی داشبورد")).toBeInTheDocument();
  await waitFor(() => expect(dashboard).toHaveBeenCalledTimes(1));
  resolvePending(adminDashboardSuccess.data);
  await waitFor(() => expect(screen.getByText(/آخرین به‌روزرسانی/)).toBeInTheDocument());
});

test("renders every fixed dashboard field without calculating totals", async () => {
  dashboard.mockResolvedValue({
    ...adminDashboardSuccess.data,
    users: { total: 12, active: 10, locked: 2 },
    content: { draft: 1, review: 2, scheduled: 3, published: 4, archived: 5 },
    submissions: { new: 6 },
    revalidation: { pending: 7, failed: 8 },
  });
  const { container } = render(<AdminDashboard />);
  await waitFor(() => expect(screen.getByText("12")).toBeInTheDocument());
  expect(screen.queryByText("۱۲")).not.toBeInTheDocument();
  for (const value of ["12", "10", "2", "1", "3", "4", "5", "6", "7", "8"]) expect(screen.getAllByText(value).length).toBeGreaterThan(0);
  expect((await axe(container)).violations).toHaveLength(0);
});

test("renders empty state for an empty aggregate response", async () => {
  dashboard.mockResolvedValue({
    ...adminDashboardSuccess.data,
    users: { total: 0, active: 0, locked: 0 },
  });
  render(<AdminDashboard />);
  expect(await screen.findByText("داشبورد خالی است")).toBeInTheDocument();
});

test.each([
  ["denied", "دسترسی محدود"],
  ["error", "خطا در دریافت اطلاعات"],
] as const)("renders the %s API state", (status, message) => {
  render(<StateMessage status={status} />);
  expect(screen.getByText(message)).toBeInTheDocument();
});
