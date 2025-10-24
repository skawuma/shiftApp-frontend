# ====== Stage 1: Build Angular ======
FROM node:20 AS build
WORKDIR /app

# Copy dependency manifests and install cleanly
COPY package*.json ./
RUN npm ci

# Copy app source code
COPY . .

# Pass your production domain at build time
ARG DOMAIN=https://schedule.samuelkawuma.com

# Update environment.prod.ts to point to your live backend API
# Works whether the file is under src/ or src/app/environments/
RUN echo "🔧 Setting API domain to ${DOMAIN}" && \
    (test -f src/environments/environment.prod.ts && \
     sed -i "s#apiUrl: 'http://.*:8080/api'#apiUrl: '${DOMAIN}/api'#" src/environments/environment.prod.ts) || \
    (test -f src/app/environments/environment.prod.ts && \
     sed -i "s#apiUrl: 'http://.*:8080/api'#apiUrl: '${DOMAIN}/api'#" src/app/environments/environment.prod.ts) || true

# Build Angular app for production (no cache)
RUN npm run build -- --configuration production

# ====== Stage 2: Serve with Nginx ======
FROM nginx:1.27-alpine

# Copy built Angular dist to Nginx web root
COPY --from=build /app/dist/ /usr/share/nginx/html/

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create ACME folder for certbot challenge
RUN mkdir -p /var/www/certbot

EXPOSE 80 443
