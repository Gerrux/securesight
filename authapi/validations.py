from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model

UserModel = get_user_model()


def validate_email(email):
    if not email or UserModel.objects.filter(email=email).exists():
        raise ValidationError('An email is needed')
    return email


def validate_username(username):
    if not username or UserModel.objects.filter(username=username).exists():
        raise ValidationError('Choose another username')
    return username


def validate_password(password):
    if not password or len(password) < 8:
        raise ValidationError('A password is needed, min 8 characters')
    return password
