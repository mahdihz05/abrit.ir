from django.shortcuts import get_object_or_404
from drf_spectacular.utils import OpenApiParameter, extend_schema
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response

from apps.core.api import VALID_LOCALES

from .models import ContractTerm, Package
from .serializers import PackageSerializer, PricingRequestSerializer
from .services import calculate_package


class PackageListView(GenericAPIView):
    authentication_classes = []
    permission_classes = []
    serializer_class = PackageSerializer

    @extend_schema(operation_id="package_list", parameters=[OpenApiParameter("locale", str)])
    def get(self, request):
        locale = request.query_params.get("locale", "fa")
        if locale not in VALID_LOCALES:
            return Response({"error": {"code": "invalid_locale", "detail": "Unsupported locale."}}, status=400)
        packages = Package.objects.filter(is_active=True).prefetch_related("translations", "addon_rates")
        serializer = PackageSerializer(packages, many=True, context={"locale": locale})
        return Response({"data": serializer.data})


class PricingCalculateView(GenericAPIView):
    authentication_classes = []
    permission_classes = []
    serializer_class = PricingRequestSerializer

    @extend_schema(operation_id="pricing_calculate")
    def post(self, request):
        request_serializer = PricingRequestSerializer(data=request.data)
        request_serializer.is_valid(raise_exception=True)
        data = request_serializer.validated_data
        package = get_object_or_404(Package.objects.prefetch_related("addon_rates"), key=data["package"], is_active=True)
        term = get_object_or_404(ContractTerm, months=data["term_months"], is_active=True)
        return Response({"data": calculate_package(package=package, term=term, users=data["users"], endpoints=data["endpoints"])})
