# Use official Node.js LTS image
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Production image
FROM node:22-alpine

WORKDIR /app

# Copy only necessary files
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/dist/models ./dist/models

ENV NODE_ENV=production
EXPOSE 80
CMD ["node", "dist/server.js"]