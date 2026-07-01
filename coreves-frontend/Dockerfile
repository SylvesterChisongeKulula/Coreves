# syntax=docker/dockerfile:1

FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
RUN npm run build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0
RUN addgroup -S nodejs && adduser -S nuxt -G nodejs
COPY --from=build --chown=nuxt:nodejs /app/.output ./.output
USER nuxt
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
