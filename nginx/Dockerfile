FROM nginx:stable-alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY /include.websocket /etc/nginx/app/include.websocket
COPY /include.forwarded /etc/nginx/app/include.forwarded
COPY ./nginx.conf /etc/nginx/conf.d/

EXPOSE 80

CMD ["/usr/sbin/nginx", "-g", "daemon off;"]