# syntax=docker/dockerfile:1

# Base stage with Node.js 22.21.1
FROM node:22.21.1-alpine AS base

# Install pnpm directly
RUN npm install -g pnpm@10.10.0

# Dependencies stage
FROM base AS deps
WORKDIR /app

# Copy package files and pnpm config
COPY package.json pnpm-lock.yaml* .npmrc ./

# Install dependencies (--ignore-scripts to skip prepare/lefthook in CI)
RUN pnpm install --frozen-lockfile --ignore-scripts

# Builder stage
FROM base AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Build arguments (値は --build-arg で渡す、Secret で一元管理)
ARG ENV
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_API_MOCK_MODE
ARG NEXT_PUBLIC_API_TIMEOUT_MS
ARG NEXT_PUBLIC_API_SLOW_THRESHOLD_MS
ARG NEXT_PUBLIC_MOCKOON_ENABLED
ARG NEXT_PUBLIC_MOCKOON_ADMIN_URL
ARG ANALYZE

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED=1 \
    NODE_ENV=production \
    ENV=${ENV} \
    NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL} \
    NEXT_PUBLIC_API_MOCK_MODE=${NEXT_PUBLIC_API_MOCK_MODE} \
    NEXT_PUBLIC_API_TIMEOUT_MS=${NEXT_PUBLIC_API_TIMEOUT_MS} \
    NEXT_PUBLIC_API_SLOW_THRESHOLD_MS=${NEXT_PUBLIC_API_SLOW_THRESHOLD_MS} \
    NEXT_PUBLIC_MOCKOON_ENABLED=${NEXT_PUBLIC_MOCKOON_ENABLED} \
    NEXT_PUBLIC_MOCKOON_ADMIN_URL=${NEXT_PUBLIC_MOCKOON_ADMIN_URL} \
    ANALYZE=${ANALYZE}

# Ensure public directory exists
RUN mkdir -p public

# Build Next.js app
RUN pnpm build

# Runner stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy built app from builder
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["node", "server.js"]
