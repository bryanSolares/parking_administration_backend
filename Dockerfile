FROM bitnami/node:18 AS builder

WORKDIR /app
COPY . .
RUN yarn
RUN yarn build

FROM bitnami/node:18 AS deploy
WORKDIR /app
COPY --from=builder /app/build /app/package.json /app/.env ./
COPY --from=builder /app/node_modules ./node_modules
RUN yarn install --production --frozen-lockfile
ENV NODE_ENV=production
EXPOSE 3500
CMD [ "node", "./app.js" ]
