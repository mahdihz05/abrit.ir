from rest_framework import serializers


class RoleDefinitionSerializer(serializers.Serializer):
    key = serializers.CharField()
    name = serializers.CharField()
    description = serializers.CharField()
    reserved = serializers.BooleanField()
    requires_django_staff = serializers.BooleanField()
    permissions = serializers.ListField(child=serializers.CharField())


class PermissionDefinitionSerializer(serializers.Serializer):
    key = serializers.CharField()
    label = serializers.CharField()
    category = serializers.CharField()
    source = serializers.ChoiceField(choices=("custom", "django"))


class RoleListResponseSerializer(serializers.Serializer):
    data = RoleDefinitionSerializer(many=True)


class RoleResponseSerializer(serializers.Serializer):
    data = RoleDefinitionSerializer()


class PermissionListResponseSerializer(serializers.Serializer):
    data = PermissionDefinitionSerializer(many=True)
