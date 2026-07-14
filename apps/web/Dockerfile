# syntax=docker/dockerfile:1
# Build from the monorepo root:
#   docker build -f apps/web/Dockerfile -t web .

FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat && corepack enable

# Prune the monorepo down to what "web" needs
FROM base AS pruner
WORKDIR /app
RUN npm install -g turbo@^2
COPY . .
RUN turbo prune web --docker

# Install dependencies and build
FROM base AS builder
WORKDIR /app
COPY --from=pruner /app/.yarnrc.yml ./
COPY --from=pruner /app/out/json/ .
RUN yarn install
COPY --from=pruner /app/out/full/ .
# rewrites() is resolved at build time, so the shell URLs must be provided here
ARG DASHBOARD_URL=http://dashboard:3001
ARG TRANSACTIONS_URL=http://transactions:3002
ENV DASHBOARD_URL=$DASHBOARD_URL
ENV TRANSACTIONS_URL=$TRANSACTIONS_URL
RUN yarn turbo run build --filter=web

# Minimal runtime image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
USER nextjs
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public
ENV PORT=3000 HOSTNAME=0.0.0.0
EXPOSE 3000
CMD ["node", "apps/web/server.js"]
