FROM node:22.23.1-alpine3.24 AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci \
    --ignore-scripts \
    --audit=false \
    --fund=false

COPY . .

RUN npm run build


FROM nginx:1.31.3-alpine3.24 AS runtime

RUN sed -i 's/listen       80;/listen       8080;/' \
        /etc/nginx/conf.d/default.conf \
    && sed -i 's/listen  \[::\]:80;/listen  [::]:8080;/' \
        /etc/nginx/conf.d/default.conf \
    && sed -i '/^user[[:space:]]\+nginx;/d' \
        /etc/nginx/nginx.conf \
    && sed -i 's|^pid .*;|pid /tmp/nginx.pid;|' \
        /etc/nginx/nginx.conf \
    && chown -R nginx:nginx \
        /var/cache/nginx \
        /etc/nginx/conf.d

COPY --from=builder \
    --chown=root:root \
    /app/dist \
    /usr/share/nginx/html

RUN find /usr/share/nginx/html -type d -exec chmod 755 {} \; \
    && find /usr/share/nginx/html -type f -exec chmod 644 {} \;

USER nginx

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]