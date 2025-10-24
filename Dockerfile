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

# Copy compiled Vite dist output
COPY --from=build /app/dist/ /usr/share/nginx/html/

# Copy your custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create folder for Certbot challenges (HTTPS validation)
RUN mkdir -p /var/www/certbot

EXPOSE 80 443
