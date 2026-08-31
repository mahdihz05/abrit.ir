import type { Package as PayloadPackage } from "@/payload-types";
import type { PricingResult } from "./types";

export function applyBasisPoints(amount: number, basisPoints: number) {
  return Math.floor((amount * basisPoints + 5000) / 10000);
}

export function calculatePackage(packages: PayloadPackage[], packageKey: string, termMonths: number, users: number, endpoints: number): PricingResult {
  if (!Number.isInteger(users) || !Number.isInteger(endpoints) || users < 0 || endpoints < 0) throw new Error("Users and endpoints must be non-negative integers.");
  const ordered = packages.filter((item) => item.isActive !== false).toSorted((left, right) => left.order - right.order);
  const selected = ordered.find((item) => item.key === packageKey);
  if (!selected) throw new Error("Unknown package.");
  const term = selected.termPrices.find((item) => item.months === termMonths);
  if (!term) throw new Error("Unsupported contract term.");
  const nextTier = ordered.find((item) => item.order > selected.order);
  if (!nextTier && (users > selected.includedUsers || endpoints > selected.includedEndpoints)) return customQuote(selected, termMonths, users, endpoints, "enterprise_boundary");
  if (nextTier && (users > nextTier.includedUsers || endpoints > nextTier.includedEndpoints)) throw new Error(`Select ${nextTier.key} or a higher package for this capacity.`);
  const extraUsers = Math.max(0, users - selected.includedUsers);
  const extraEndpoints = Math.max(0, endpoints - selected.includedEndpoints);
  const userRate = selected.extraUserMonthlyToman ?? 0;
  const endpointRate = selected.extraEndpointMonthlyToman ?? 0;
  if (extraUsers && !userRate) return customQuote(selected, termMonths, users, endpoints, "missing_user_rate");
  if (extraEndpoints && !endpointRate) return customQuote(selected, termMonths, users, endpoints, "missing_endpoint_rate");
  const baseTerm = selected.baseMonthlyToman * termMonths;
  const baseDiscount = applyBasisPoints(baseTerm, term.discountBps ?? 0);
  const extrasMonthly = extraUsers * userRate + extraEndpoints * endpointRate;
  const onboarding = applyBasisPoints(selected.baseMonthlyToman, term.onboardingBps ?? 0);
  return {
    currency: selected.currency, package: selected.key, term_months: termMonths, users, endpoints, quote_required: false,
    monthly_recurring_toman: selected.baseMonthlyToman + extrasMonthly,
    contract_total_toman: baseTerm - baseDiscount + extrasMonthly * termMonths + onboarding,
    lines: [
      { key: "base", amount_toman: baseTerm, quantity: 1 },
      { key: "base_discount", amount_toman: -baseDiscount, quantity: 1 },
      { key: "extra_users", amount_toman: extraUsers * userRate * termMonths, quantity: extraUsers },
      { key: "extra_endpoints", amount_toman: extraEndpoints * endpointRate * termMonths, quantity: extraEndpoints },
      { key: "onboarding", amount_toman: onboarding, quantity: 1 },
    ],
    recommended_upgrade: nextTier && (extraUsers || extraEndpoints) ? nextTier.key : null,
  };
}

function customQuote(selected: PayloadPackage, termMonths: number, users: number, endpoints: number, reason: string): PricingResult {
  return { currency: selected.currency, package: selected.key, term_months: termMonths, users, endpoints, quote_required: true, reason, monthly_recurring_toman: null, contract_total_toman: null, lines: [], recommended_upgrade: null };
}
