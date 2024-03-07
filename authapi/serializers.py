from django.contrib.auth import get_user_model, authenticate
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from authapi.validations import validate_username, validate_password, validate_email

UserModel = get_user_model()


class CustomAuthTokenSerializer(serializers.Serializer):
    token = serializers.CharField()

    def create(self, validated_data):
        return RefreshToken.for_user(self.context['request'].user)

    def validate(self, attrs):
        token = attrs.get('token')
        try:
            refresh_token = RefreshToken(token)
            refresh_token.verify()
            user = refresh_token.payload['user_id']
            self.context['request'].user = UserModel.objects.get(pk=user)
            return {'token': str(refresh_token)}
        except Exception as e:
            raise serializers.ValidationError('Invalid token')

    @staticmethod
    def get_token(user):
        refresh = RefreshToken.for_user(user)
        return {'refresh': str(refresh), 'access': str(refresh.token)}


class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])

    class Meta:
        model = get_user_model()
        fields = ('email', 'username', 'password')
        extra_kwargs = {
            'email': {'validators': [validate_email]},
            'username': {'validators': [validate_username]}
        }

    def create(self, validated_data):
        user = get_user_model().objects.create_user(**validated_data)
        return user


class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(validators=[validate_password])

    def validate(self, attrs):
        user = authenticate(**attrs)
        if user:
            refresh = RefreshToken.for_user(user)
            attrs['refresh'] = str(refresh)
            attrs['access'] = str(refresh.access_token)
            return attrs
        else:
            raise serializers.ValidationError('Invalid username or password')


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ('email', 'username')
