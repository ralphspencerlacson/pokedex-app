# syntax=docker/dockerfile:1

# Multi-stage Dockerfile for building a Vite app and serving the built `dist`
# with nginx. The builder installs devDependencies, runs the build, and the
# final image is a minimal nginx image that serves static files.

ARG NODE_VERSION=24.12.0

################################################################################
# Builder stage: install deps (including devDependencies) and build the app
FROM node:${NODE_VERSION}-alpine AS builder
WORKDIR /usr/src/app

# Install dependencies (including devDependencies) to allow `yarn build` to run.
# Copy lockfile and package manifest first to leverage Docker layer caching.
COPY package.json yarn.lock* ./
RUN yarn install --frozen-lockfile

# Copy source and build
COPY . .
RUN yarn build

################################################################################
# Final stage: serve the built files with nginx (small, production-ready image)
FROM nginx:stable-alpine AS final
WORKDIR /usr/share/nginx/html

# Remove default nginx config and create a simple SPA-friendly server block
RUN rm /etc/nginx/conf.d/default.conf
RUN printf 'server {\n  listen 2010;\n  server_name _;\n  root /usr/share/nginx/html;\n  index index.html;\n  location / {\n    try_files $uri $uri/ /index.html;\n  }\n}\n' > /etc/nginx/conf.d/default.conf

# Copy built files from the builder stage
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

EXPOSE 2010
CMD ["nginx", "-g", "daemon off;"]
