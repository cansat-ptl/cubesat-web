FROM artshellorok/nginx

ADD ./html /usr/share/nginx/html
ADD ./nginx_config /etc/nginx