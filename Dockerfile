FROM ubuntu:latest
LABEL authors="kalin"

ENTRYPOINT ["top", "-b"]

FROM python:3.10

ENV PYTHONUNBUFFERED 1

WORKDIR /app

COPY requirements.txt /app/

RUN pip install --no-cache-dir -r requirements.txt

COPY . /app/

RUN python manage.py collectstatic --no-input

EXPOSE 8000

CMD ["gunicorn", "myproject.wsgi", "--bind=0.0.0.0:8000"]