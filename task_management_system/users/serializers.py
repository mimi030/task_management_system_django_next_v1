from djoser import serializers
from .models import CustomUser


class UserCreateSerializer(serializers.UserCreateSerializer):
    class Meta(serializers.UserCreateSerializer.Meta):
        model = CustomUser
        fields = (
            'id',
            'email',
            'password',
            're_password',
            'first_name',
            'last_name',
            'role'
        )


class UserSerializer(serializers.UserCreateSerializer):
    class Meta(serializers.UserCreateSerializer):
        model = CustomUser
        fields = (
            'id',
            'email',
            'username',
            'first_name',
            'last_name'
        )
