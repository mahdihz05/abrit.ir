from __future__ import annotations

from dataclasses import asdict, dataclass

from django.core.exceptions import ValidationError

from .models import AddonRate, ContractTerm, Package


@dataclass(frozen=True)
class PricingLine:
    key: str
    amount_toman: int
    quantity: int = 1


def apply_basis_points(amount: int, basis_points: int) -> int:
    """Return a nearest-toman percentage using exact integer arithmetic."""
    return (amount * basis_points + 5000) // 10000


def calculate_package(*, package: Package, term: ContractTerm, users: int, endpoints: int) -> dict:
    if users < 0 or endpoints < 0:
        raise ValidationError("Users and endpoints cannot be negative.")

    next_tier = Package.objects.filter(is_active=True, order__gt=package.order).order_by("order").first()
    if next_tier is None and (users > package.included_users or endpoints > package.included_endpoints):
        return _custom_quote(package, term, users, endpoints, reason="enterprise_boundary")
    if next_tier and (users > next_tier.included_users or endpoints > next_tier.included_endpoints):
        raise ValidationError({"package": f"Select {next_tier.key} or a higher package for this capacity."})

    rates = {rate.addon_type: rate.monthly_toman for rate in package.addon_rates.all()}
    extra_users = max(0, users - package.included_users)
    extra_endpoints = max(0, endpoints - package.included_endpoints)
    if extra_users and AddonRate.AddonType.USER not in rates:
        return _custom_quote(package, term, users, endpoints, reason="missing_user_rate")
    if extra_endpoints and AddonRate.AddonType.ENDPOINT not in rates:
        return _custom_quote(package, term, users, endpoints, reason="missing_endpoint_rate")

    base_term = package.base_monthly_toman * term.months
    base_discount = apply_basis_points(base_term, term.discount_bps)
    discounted_base = base_term - base_discount
    extra_user_monthly = extra_users * rates.get(AddonRate.AddonType.USER, 0)
    extra_endpoint_monthly = extra_endpoints * rates.get(AddonRate.AddonType.ENDPOINT, 0)
    addons_term = (extra_user_monthly + extra_endpoint_monthly) * term.months
    onboarding = apply_basis_points(package.base_monthly_toman, term.onboarding_bps)
    lines = [
        PricingLine("base", base_term),
        PricingLine("base_discount", -base_discount),
        PricingLine("extra_users", extra_user_monthly * term.months, extra_users),
        PricingLine("extra_endpoints", extra_endpoint_monthly * term.months, extra_endpoints),
        PricingLine("onboarding", onboarding),
    ]
    return {
        "currency": package.currency,
        "package": package.key,
        "term_months": term.months,
        "users": users,
        "endpoints": endpoints,
        "quote_required": False,
        "monthly_recurring_toman": package.base_monthly_toman + extra_user_monthly + extra_endpoint_monthly,
        "contract_total_toman": discounted_base + addons_term + onboarding,
        "lines": [asdict(line) for line in lines],
        "recommended_upgrade": next_tier.key if next_tier and (extra_users or extra_endpoints) else None,
    }


def _custom_quote(package, term, users, endpoints, *, reason):
    return {
        "currency": package.currency,
        "package": package.key,
        "term_months": term.months,
        "users": users,
        "endpoints": endpoints,
        "quote_required": True,
        "reason": reason,
        "monthly_recurring_toman": None,
        "contract_total_toman": None,
        "lines": [],
        "recommended_upgrade": None,
    }
