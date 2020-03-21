FROM artshellorok/nginx

ADD ./dist /usr/share/nginx/html
ADD ./nginx_config /etc/nginx
