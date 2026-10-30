FROM node:22-alpine
RUN apk add --no-cache pandoc openssl ca-certificates
WORKDIR /app/backend
COPY backend/package.json backend/package-lock.json ./
COPY backend/prisma ./prisma
COPY backend/prisma.config.ts ./
RUN npm ci --omit=dev --cache=/tmp/npm-cache && rm -rf /tmp/npm-cache
COPY --chown=node:node backend/ ./
RUN mkdir -p uploads && chown -R node:node uploads
ENV NODE_ENV=production
ENV PORT=3000
USER node
EXPOSE 3000
CMD ["node", "server.js"]
