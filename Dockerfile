# ====== Stage 1: Build with Vite ======
FROM node:20 AS build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy application source
COPY . .

# Inject production backend URL (optional)
ARG DOMAIN=https://schedule.samuelkawuma.com
RUN sed -i "s#apiUrl: 'http://.*:8080/api'#apiUrl: '${DOMAIN}/api'#" src/app/environments/environment.prod.ts || true

# Build using Vite
RUN npm run build

# ====== Stage 2: Serve with Nginx ======
FROM nginx:1.27-alpine

# Remove default nginx welcome page (important!)
RUN rm -f /usr/share/nginx/html/index.html

# Copy built Angular app (correct folder)
COPY --from=build /app/dist/shiftApp-frontend/ /usr/share/nginx/html/

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# ACME challenge directory for SSL renewals
RUN mkdir -p /var/www/certbot

EXPOSE 80 443
