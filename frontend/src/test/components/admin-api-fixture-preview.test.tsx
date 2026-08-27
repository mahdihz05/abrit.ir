import { axe } from "jest-axe";
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { adminApiErrors, adminSessionSuccess } from "@/test/fixtures/admin-api";
import { AdminApiFixturePreview } from "./admin-api-fixture-preview";

test("renders an accessible stable Admin API error", async () => {
  const { container } = render(<AdminApiFixturePreview response={adminApiErrors.permissionDenied} />);

  expect(screen.getByRole("alert")).toHaveTextContent(adminApiErrors.permissionDenied.error.detail);
  expect((await axe(container)).violations).toHaveLength(0);
});

test("renders a successful session fixture", () => {
  render(<AdminApiFixturePreview response={adminSessionSuccess} />);

  expect(screen.getByText("Signed in as site-admin")).toBeVisible();
});
