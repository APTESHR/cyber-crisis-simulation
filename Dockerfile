# ==============================================================================
# Multi-Stage Production Dockerfile for Cyber Crisis Simulation SPA
# ==============================================================================

# Stage 1: Build the React + Vite application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install clean dependencies
RUN npm ci

# Copy full source code
COPY . .

# Build production bundle
RUN npm run build

# Stage 2: Serve with ultra-lightweight Nginx Alpine
FROM nginx:alpine

# Remove default Nginx HTML files
RUN rm -rf /usr/share/nginx/html/*

# Copy compiled assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 5173
EXPOSE 5173

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
