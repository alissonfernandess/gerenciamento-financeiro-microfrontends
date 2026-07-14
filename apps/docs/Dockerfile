# syntax=docker/dockerfile:1
# Build from the monorepo root:
#   docker build -f apps/docs/Dockerfile -t docs .

FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat && corepack enable

# Prune the monorepo down to what "docs" needs
FROM base AS pruner
WORKDIR /app
RUN npm install -g turbo@^2
COPY . .
RUN turbo prune docs --docker

# Install dependencies and build
FROM base AS builder
WORKDIR /app
COPY --from=pruner /app/.yarnrc.yml ./
COPY --from=pruner /app/out/json/ .
RUN yarn install
COPY --from=pruner /app/out/full/ .
RUN yarn turbo run build --filter=docs

# Minimal runtime image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
USER nextjs
COPY --from=builder --chown=nextjs:nodejs /app/apps/docs/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/docs/.next/static ./apps/docs/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/docs/public ./apps/docs/public
ENV PORT=3003 HOSTNAME=0.0.0.0
EXPOSE 3003
CMD ["node", "apps/docs/server.js"]
