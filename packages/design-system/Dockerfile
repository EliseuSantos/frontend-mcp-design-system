FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* pnpm-lock.yaml* ./
COPY packages/design-system/package.json ./packages/design-system/

# Install dependencies (adjust for pnpm/npm/yarn)
RUN npm install -g pnpm && pnpm install --frozen-lockfile || npm ci

# Copy design-system source
COPY packages/design-system ./packages/design-system
COPY tsconfig.base.json ./

# Build Storybook static
WORKDIR /app/packages/design-system
RUN pnpm storybook:build || npm run storybook:build

# Build MCP server
RUN pnpm mcp:build || npm run mcp:build

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=13316
ENV STORYBOOK_STATIC_PATH=/app/storybook-static
ENV LOG_LEVEL=info

# Copy only production dependencies
COPY --from=builder /app/packages/design-system/package.json ./
COPY --from=builder /app/node_modules ./node_modules

# Copy built MCP server
COPY --from=builder /app/packages/design-system/dist/mcp-server ./dist/mcp-server

# Copy Storybook static build
COPY --from=builder /app/packages/design-system/storybook-static ./storybook-static

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:13316/healthz', (r) => { process.exit(r.statusCode === 200 ? 0 : 1) })"

EXPOSE 13316

CMD ["node", "dist/mcp-server/server.js"]

