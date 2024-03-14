FROM ubuntu:latest
FROM python:3.10

LABEL authors="kalinin"

ENV PYTHONUNBUFFERED 1

# Set the working directory to /app
WORKDIR /app

# Clone the repository
RUN git clone https://github.com/Gerrux/securesight.git

# Change the working directory to the cloned repository's backend folder
WORKDIR /app/securesight/

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN python manage.py collectstatic --no-input

EXPOSE 8000

CMD ["gunicorn", "securesight.wsgi", "--bind=0.0.0.0:8000"]