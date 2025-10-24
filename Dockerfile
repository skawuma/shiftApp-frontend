# ====== Stage 1: Build Angular/Vite ======
FROM node:20 AS build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Inject backend API URL
ARG DOMAIN=https://schedule.samuelkawuma.com
RUN sed -i "s#apiUrl: 'http://.*:8080/api'#apiUrl: '${DOMAIN}/api'#" src/app/environments/environment.prod.ts || true

# Build using Vite (Angular builder output goes to dist/shiftApp-frontend/browser)
RUN npm run build

# ====== Stage 2: Nginx Runtime ======
FROM nginx:1.27-alpine

# Remove default nginx HTML
RUN rm -rf /usr/share/nginx/html/*

# ✅ Copy the correct build output
COPY --from=build /app/dist/shiftApp-frontend/browser/ /usr/share/nginx/html/

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# ACME folder for certbot challenges
RUN mkdir -p /var/www/certbot

EXPOSE 80 443
