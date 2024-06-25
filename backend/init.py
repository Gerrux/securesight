import os
import time

import django

from authapi.models import CustomUser


flag = True

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'securesight.settings')
django.setup()


def create_superuser_if_not_exists():
    username = os.environ.get("DJANGO_SUPERUSER_USERNAME")
    email = os.environ.get("DJANGO_SUPERUSER_EMAIL")
    password = os.environ.get("DJANGO_SUPERUSER_PASSWORD")

    if not CustomUser.objects.filter(username=username).exists():
        CustomUser.objects.create_superuser(username, email, password)
        print(f"Superuser {username} was created")
    else:
        print(f"Superuser {username} already exists")


if __name__ == "__main__":
    create_superuser_if_not_exists()
    time.sleep(3)
