import pytest
from django.core.exceptions import ValidationError

from .models import AddonRate, ContractTerm, Package
from .services import calculate_package


@pytest.fixture
def packages(db):
    essential = Package.objects.create(
        key="essential", order=1, base_monthly_toman=12_950_000,
        included_users=5, included_endpoints=6,
    )
    standard = Package.objects.create(
        key="standard", order=2, base_monthly_toman=19_500_000,
        included_users=10, included_endpoints=12, included_servers=1,
    )
    enterprise = Package.objects.create(
        key="enterprise", order=5, base_monthly_toman=79_900_000,
        included_users=40, included_endpoints=60, included_servers=8, included_sites=5,
    )
    for package, user_rate, endpoint_rate in (
        (essential, 1_590_000, 790_000),
        (standard, 1_990_000, 990_000),
        (enterprise, 4_990_000, 2_490_000),
    ):
        AddonRate.objects.create(package=package, addon_type=AddonRate.AddonType.USER, monthly_toman=user_rate)
        AddonRate.objects.create(package=package, addon_type=AddonRate.AddonType.ENDPOINT, monthly_toman=endpoint_rate)
    return essential, standard, enterprise


@pytest.mark.django_db
def test_three_month_essential_matches_approved_table_plus_onboarding(packages):
    essential, _, _ = packages
    term = ContractTerm.objects.create(months=3, discount_bps=300, onboarding_bps=5000)
    result = calculate_package(package=essential, term=term, users=5, endpoints=6)
    assert result["lines"][0]["amount_toman"] + result["lines"][1]["amount_toman"] == 37_684_500
    assert result["contract_total_toman"] == 44_159_500


@pytest.mark.django_db
def test_overage_is_allowed_only_until_next_tier(packages):
    essential, _, _ = packages
    term = ContractTerm.objects.create(months=12, discount_bps=800, onboarding_bps=0)
    valid = calculate_package(package=essential, term=term, users=10, endpoints=12)
    assert valid["quote_required"] is False
    with pytest.raises(ValidationError):
        calculate_package(package=essential, term=term, users=11, endpoints=12)


@pytest.mark.django_db
def test_enterprise_overage_requires_custom_quote(packages):
    _, _, enterprise = packages
    term = ContractTerm.objects.create(months=6, discount_bps=500, onboarding_bps=2500)
    result = calculate_package(package=enterprise, term=term, users=41, endpoints=60)
    assert result["quote_required"] is True
    assert result["reason"] == "enterprise_boundary"
