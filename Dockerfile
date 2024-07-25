FROM bitnami/node:22 AS builder

WORKDIR /app
COPY . .
RUN yarn install
RUN yarn build

FROM bitnami/node:22 AS deploy
WORKDIR /app
COPY --from=builder /app/build /app/package.json /app/.env ./
COPY --from=builder /app/node_modules ./node_modules
RUN yarn install --production --frozen-lockfile
ENV NODE_ENV=production
EXPOSE 3500
CMD [ "node", "./server/app.js" ]
