FROM ubuntu:latest
FROM python:3.10

WORKDIR /usr/src/app
RUN mkdir -p $WORKDIR/static
RUN mkdir -p $WORKDIR/media

#не создавать файлы кэша .pyc
ENV PYTHONDONTWRITEBYTECODE 1
# не помещать в буфер потоки stdout и stderr
ENV PYTHONUNBUFFERED 1

# обновим pip
RUN pip install --upgrade pip

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY ./entrypoint.sh .
ENTRYPOINT ["sh", "/app/entrypoint.sh"]

COPY . .