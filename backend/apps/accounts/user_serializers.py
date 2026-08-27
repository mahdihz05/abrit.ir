from rest_framework import serializers


class UserRoleSerializer(serializers.Serializer):
    key = serializers.CharField()
    name = serializers.CharField()


class UserSummarySerializer(serializers.Serializer):
    id = serializers.IntegerField()
    username = serializers.CharField()
    email = serializers.EmailField(allow_blank=True)
    first_name = serializers.CharField(allow_blank=True)
    last_name = serializers.CharField(allow_blank=True)
    is_active = serializers.BooleanField()
    is_superuser = serializers.BooleanField()
    role = UserRoleSerializer(allow_null=True)
    is_locked = serializers.BooleanField()
    locked_until = serializers.DateTimeField(allow_null=True)
    last_login = serializers.DateTimeField(allow_null=True)
    date_joined = serializers.DateTimeField()


class UserDetailSerializer(UserSummarySerializer):
    pass


class UserCreateSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField(allow_blank=True, required=False, default="")
    first_name = serializers.CharField(max_length=150, allow_blank=True, required=False, default="")
    last_name = serializers.CharField(max_length=150, allow_blank=True, required=False, default="")
    password = serializers.CharField(write_only=True, trim_whitespace=False)
    role = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    is_active = serializers.BooleanField(required=False, default=True)


class UserPatchSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150, required=False)
    email = serializers.EmailField(allow_blank=True, required=False)
    first_name = serializers.CharField(max_length=150, allow_blank=True, required=False)
    last_name = serializers.CharField(max_length=150, allow_blank=True, required=False)
    role = serializers.CharField(required=False, allow_null=True, allow_blank=True)


class PasswordSerializer(serializers.Serializer):
    password = serializers.CharField(write_only=True, trim_whitespace=False)


class ChangedResponseSerializer(serializers.Serializer):
    data = serializers.DictField(child=serializers.BooleanField())


class UserResponseSerializer(serializers.Serializer):
    data = UserDetailSerializer()


class UserPageMetaSerializer(serializers.Serializer):
    page = serializers.IntegerField()
    page_size = serializers.IntegerField()
    total = serializers.IntegerField()
    total_pages = serializers.IntegerField()


class PaginatedUserSerializer(serializers.Serializer):
    data = UserSummarySerializer(many=True)
    meta = UserPageMetaSerializer()
