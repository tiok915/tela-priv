# syntax=docker/dockerfile:1

# ── deps: install production-ready node_modules from the lockfile ─────────────
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ── builder: compile the Next.js app (standalone output) ─────────────────────
FROM node:20-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ── runner: minimal image with just the standalone server + assets ───────────
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Run as an unprivileged user.
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Standalone server (includes a trimmed node_modules) + static assets.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Protected media is read at runtime from process.cwd()/private-media, so it must
# live next to the server (it is NOT bundled by Next's output tracing).
COPY --from=builder --chown=nextjs:nodejs /app/private-media ./private-media

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
