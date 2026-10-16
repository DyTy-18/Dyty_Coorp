# syntax=docker/dockerfile:1
# Imagen para Dokploy: build multi-etapa con output "standalone" de Next.js

FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat

# --- Dependencias ---
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# --- Build ---
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Las variables NEXT_PUBLIC_* se incrustan en el build: pásalas como build args en Dokploy
ARG NEXT_PUBLIC_WHATSAPP_NUMBER
ENV NEXT_PUBLIC_WHATSAPP_NUMBER=$NEXT_PUBLIC_WHATSAPP_NUMBER
ENV NEXT_TELEMETRY_DISABLED=1
# public/ puede no existir en el repo (git no guarda carpetas vacías)
RUN mkdir -p public && npm run build

# --- Runtime ---
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

# Leads del formulario (src/lib/leads.ts). En Dokploy, monta un volumen en /app/data para no perderlos.
ENV DATA_DIR=/app/data
RUN mkdir -p /app/data && chown nextjs:nodejs /app/data

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/ >/dev/null || exit 1

CMD ["node", "server.js"]
