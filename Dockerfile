FROM node:18-alpine AS builder

WORKDIR /app
COPY package.json ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

FROM node:18-alpine AS deploy

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./package.json
COPY ./.env ./

RUN yarn install --production --frozen-lockfile

ENV NODE_ENV=production

RUN chown -R appuser:appgroup /app

HEALTHCHECK --interval=1.30s --timeout=30s --start-period=30s --retries=3 CMD [ "curl", "-f", "http://localhost:3500/health" ]

EXPOSE 3500

USER appuser

CMD ["node", "./build/index.js"]
