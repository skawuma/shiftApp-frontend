# ====== Build Angular ======
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Optionally set API URL based on DOMAIN build-arg (best-effort for common path)
ARG DOMAIN
# Try environment.prod in common locations; ignore errors if not present
RUN (test -f src/environments/environment.prod.ts && sed -i "s#apiUrl: 'http://.*:8080/api'#apiUrl: 'https://${DOMAIN}/api'#" src/environments/environment.prod.ts) || true
RUN (test -f src/app/environments/environment.prod.ts && sed -i "s#apiUrl: 'http://.*:8080/api'#apiUrl: 'https://${DOMAIN}/api'#" src/app/environments/environment.prod.ts) || true

RUN npm run build -- --configuration production

# ====== Serve with Nginx ======
FROM nginx:1.27-alpine

# Copy SPA build (support both Angular build output styles)
COPY --from=build /app/dist/ /usr/share/nginx/html/

# Nginx config for SPA + reverse proxy to backend
COPY nginx.conf /etc/nginx/conf.d/default.conf

# ACME webroot for certbot challenges
RUN mkdir -p /var/www/certbot

EXPOSE 80 443
