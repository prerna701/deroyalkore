# syntax=docker/dockerfile:1
# Stage 1: Build the application
FROM node:24-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

COPY . .
ARG VITE_BACKEND_DOMAIN
ENV VITE_BACKEND_DOMAIN=$VITE_BACKEND_DOMAIN
RUN npm run build

FROM node:24-alpine

WORKDIR /usr/src/app

RUN apk add --no-cache bash && npm install -g serve

COPY package*.json ./
COPY tsconfig.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY wait-for-it.sh /opt/wait-for-it.sh

# files/ must stay writable by the non-root user for local-driver uploads
RUN chmod +x /opt/wait-for-it.sh && \
    mkdir -p /usr/src/app/files && \
    chown -R node:node /usr/src/app/files /opt/wait-for-it.sh

USER node

EXPOSE 3000

HEALTHCHECK --interval=10s --timeout=3s --start-period=15s --retries=5 \
  CMD node -e "const p=process.env.PORT||3000;require('http').get('http://127.0.0.1:'+p+'/',r=>process.exit(r.statusCode<500?0:1)).on('error',()=>process.exit(1))"

CMD ["serve", "-s", "dist", "-l", "3000"]
