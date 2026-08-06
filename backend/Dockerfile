
FROM node:24-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN --mount=type=cache,target=/root/.npm \
    npm ci

COPY . .

RUN npm run build \
    && npm prune --omit=dev

FROM node:24-alpine

ENV NODE_ENV=production
WORKDIR /usr/src/app

COPY package*.json ./

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/data ./data
COPY wait-for-it.sh /opt/wait-for-it.sh

# files/ must stay writable by the non-root user for local-driver uploads
RUN chmod +x /opt/wait-for-it.sh && \
    mkdir -p /usr/src/app/files && \
    mkdir -p /usr/src/app/uploads && \
    chown -R node:node /usr/src/app/files /usr/src/app/uploads /usr/src/app/data /opt/wait-for-it.sh /opt/wait-for-it.sh

USER node

EXPOSE 7000

HEALTHCHECK --interval=10s --timeout=3s --start-period=15s --retries=5 \
  CMD node -e "const p=process.env.PORT||7000;require('http').get({hostname:'127.0.0.1',port:p,path:'/healthz',timeout:2000},r=>process.exit(r.statusCode<500?0:1)).on('error',()=>process.exit(1))"

CMD ["node", "dist/server.js"]