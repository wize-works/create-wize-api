# Stage 1: Builder
FROM node:22-alpine AS builder

WORKDIR /app

# Accept build-time NODE_ENV
ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# Copy source code and build
COPY . .
RUN npm run build

# Stage 2: Runtime
FROM node:22-alpine

# Create non-root user
RUN addgroup -S app && adduser -S appuser -G app
USER appuser

WORKDIR /app

# OpenContainers-compliant labels
LABEL org.opencontainers.image.source="https://github.com/wize-works/__PROJECT_NAME__"
LABEL org.opencontainers.image.documentation="https://github.com/wize-works/__PROJECT_NAME__"
LABEL org.opencontainers.image.revision=$GITHUB_SHA

# Copy production files from builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/dist/models ./dist/models

# Environment and port
ENV NODE_ENV=production
EXPOSE 80

# Optional: Healthcheck (Kubernetes can use this too)
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s CMD wget -qO- http://localhost:80/health || exit 1

# Start the app
CMD ["node", "dist/server.js"]
