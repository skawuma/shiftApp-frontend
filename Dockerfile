# ====== Stage 1: Build Angular/Vite ======
FROM node:20 AS build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Inject backend API URL for the production build.
ARG API_URL=https://api-schedule.samuelkawuma.com/api
RUN sed -i "s#apiUrl: '.*'#apiUrl: '${API_URL}'#" src/app/environments/environment.ts

# Build using Vite (Angular builder output goes to dist/shiftApp-frontend/browser)
RUN npm run build

# ====== Stage 2: Caddy Runtime ======
FROM caddy:2-alpine

# Remove default Caddy site
RUN rm -rf /usr/share/caddy/*

# Copy the Angular browser build output
COPY --from=build /app/dist/shiftApp-frontend/browser/ /usr/share/caddy/

# Copy Caddy config
COPY Caddyfile /etc/caddy/Caddyfile

EXPOSE 80
