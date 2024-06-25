#!/bin/sh

python clear_migrations.py

python manage.py makemigrations videoanalytics
python manage.py makemigrations authapi
python manage.py migrate --no-input
python manage.py collectstatic --no-input

python init.py

gunicorn securesight.wsgi:application --bind 0.0.0.0:8000  --workers 4 --threads 4