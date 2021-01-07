FROM nginx:alpine

RUN apk add openssl && \
    openssl dhparam -out /etc/ssl/certs/dhparam.pem 4096

EXPOSE 80 443
