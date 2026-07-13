# syntax=docker/dockerfile:1
# Build from the monorepo root:
#   docker build -f apps/dashboard/Dockerfile -t dashboard .

FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat && corepack enable

# Prune the monorepo down to what "dashboard" needs
FROM base AS pruner
WORKDIR /app
RUN npm install -g turbo@^2
COPY . .
RUN turbo prune dashboard --docker

# Install dependencies and build
FROM base AS builder
WORKDIR /app
COPY --from=pruner /app/.yarnrc.yml ./
COPY --from=pruner /app/out/json/ .
RUN yarn install
COPY --from=pruner /app/out/full/ .
RUN yarn turbo run build --filter=dashboard

# Minimal runtime image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
USER nextjs
COPY --from=builder --chown=nextjs:nodejs /app/apps/dashboard/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/dashboard/.next/static ./apps/dashboard/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/dashboard/public ./apps/dashboard/public
ENV PORT=3001 HOSTNAME=0.0.0.0
EXPOSE 3001
CMD ["node", "apps/dashboard/server.js"]
