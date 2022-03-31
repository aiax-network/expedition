FROM node:10 AS builder
RUN \
    apt-get update && apt-get upgrade -q -y && \
    apt-get install -y ca-certificates git node-gyp make
WORKDIR /root/expedition

# Cache npm install
COPY package*.json ./
RUN npm install
COPY . .

# Build static assets
RUN npm run build

# STEP 2 build a small nginx image with static website
FROM nginx:alpine

# Config to always open /index.html because of client-side routing
RUN echo "server { \
    listen       80; \
    listen  [::]:80; \
    server_name  localhost; \
    location / { \
        root   /usr/share/nginx/html; \
        index  index.html; \
        try_files \$uri /index.html; \
    } \
}" > /etc/nginx/conf.d/default.conf

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy static assets to nginx image
COPY --from=builder /root/expedition/build/ /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
