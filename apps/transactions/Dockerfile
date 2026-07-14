# syntax=docker/dockerfile:1
# Build from the monorepo root:
#   docker build -f apps/transactions/Dockerfile -t transactions .

FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat && corepack enable

# Prune the monorepo down to what "transactions" needs
FROM base AS pruner
WORKDIR /app
RUN npm install -g turbo@^2
COPY . .
RUN turbo prune transactions --docker

# Install dependencies and build
FROM base AS builder
WORKDIR /app
COPY --from=pruner /app/.yarnrc.yml ./
COPY --from=pruner /app/out/json/ .
RUN yarn install
COPY --from=pruner /app/out/full/ .
RUN yarn turbo run build --filter=transactions

# Minimal runtime image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
USER nextjs
COPY --from=builder --chown=nextjs:nodejs /app/apps/transactions/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/transactions/.next/static ./apps/transactions/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/transactions/public ./apps/transactions/public
ENV PORT=3002 HOSTNAME=0.0.0.0
EXPOSE 3002
CMD ["node", "apps/transactions/server.js"]
