FROM takatost/node-yarn:latest as chedianai-management-builder

MAINTAINER JohnWang <wangjiajun@vchangyi.com>

RUN yarn config set disturl "https://npm.taobao.org/dist"; \
    yarn config set phantomjs_cdnurl "http://npm.taobao.org/mirrors/phantomjs"; \
    yarn config set chromedriver_cdnurl "http://npm.taobao.org/mirrors/chromedriver";

COPY / /src

RUN cd /src && \
  yarn install --frozen-lockfile && \
  yarn build && \
  mv dist/static/js/app.*.js dist/static/js/app.js -f && \
  mv dist/static/js/vendor.*.js dist/static/js/vendor.js -f && \
  mv dist/static/js/manifest.*.js dist/static/js/manifest.js -f && \
  mv dist/static/css/app.*.css dist/static/css/app.css -f && \
  mkdir -p /output && \
  cp dist/* /output/ -rf

WORKDIR /output

FROM nginx:1.13-alpine

RUN rm -rf /usr/share/nginx/html/*
RUN echo "server {listen 80; server_name  localhost; location / { root   /usr/share/nginx/html; rewrite '^/static/(js|css)/(app|vendor|manifest).(.*).(js|css)$' /static/\$1/\$2.\$4; index  index.html index.htm; } gzip on; gzip_http_version 1.1; gzip_comp_level 5; gzip_min_length 256; gzip_proxied any; gzip_vary on; gzip_types application/atom+xml application/javascript application/json application/rss+xml application/vnd.ms-fontobject application/x-font-ttf application/x-web-app-manifest+json application/xhtml+xml application/xml font/opentype image svg+xml image/x-icon text/css text/plain text/x-component;}" > /etc/nginx/conf.d/default.conf;
COPY --from=chedianai-management-builder /output/ /usr/share/nginx/html/
