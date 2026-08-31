import { describe, expect, it } from "vitest";
import type { Package as PayloadPackage } from "@/payload-types";
import { applyBasisPoints, calculatePackage } from "./pricing";

function packageFixture(partial: Partial<PayloadPackage>): PayloadPackage {
  return {
    id: partial.order ?? 1,
    key: "essential",
    order: 1,
    name: "Essential",
    baseMonthlyToman: 12_950_000,
    includedUsers: 5,
    maxExtraUsers: 0,
    includedEndpoints: 6,
    includedServers: 0,
    includedSites: 1,
    extraUserMonthlyToman: 1_590_000,
    extraEndpointMonthlyToman: 790_000,
    currency: "IRT",
    isFeatured: false,
    isActive: true,
    termPrices: [{ cycle: "quarterly", months: 3, totalToman: 44_159_500, discountBps: 300, onboardingBps: 5000 }],
    updatedAt: "2026-01-01T00:00:00.000Z",
    createdAt: "2026-01-01T00:00:00.000Z",
    ...partial,
  };
}

describe("calculatePackage Django parity", () => {
  it("uses nearest-toman basis point arithmetic", () => {
    expect(applyBasisPoints(38_850_000, 300)).toBe(1_165_500);
  });

  it("matches the approved three-month essential total plus onboarding", () => {
    const result = calculatePackage([packageFixture({})], "essential", 3, 5, 6);
    expect((result.lines[0]?.amount_toman ?? 0) + (result.lines[1]?.amount_toman ?? 0)).toBe(37_684_500);
    expect(result.contract_total_toman).toBe(44_159_500);
  });

  it("permits overage only up to the next tier", () => {
    const essential = packageFixture({
      termPrices: [{ cycle: "annually", months: 12, totalToman: 142_968_000, discountBps: 800, onboardingBps: 0 }],
    });
    const standard = packageFixture({ id: 2, key: "standard", order: 2, includedUsers: 10, includedEndpoints: 12 });
    expect(calculatePackage([essential, standard], "essential", 12, 10, 12).quote_required).toBe(false);
    expect(() => calculatePackage([essential, standard], "essential", 12, 11, 12)).toThrow(/standard/);
  });

  it("requires a custom quote beyond the final tier", () => {
    const enterprise = packageFixture({ id: 5, key: "enterprise", order: 5, includedUsers: 40, includedEndpoints: 60 });
    const result = calculatePackage([enterprise], "enterprise", 3, 41, 60);
    expect(result.quote_required).toBe(true);
    expect(result.reason).toBe("enterprise_boundary");
  });
});
