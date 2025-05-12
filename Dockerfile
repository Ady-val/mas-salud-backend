FROM node:22.14.0-slim AS builder
WORKDIR /usr/src/app

RUN npm install -g pnpm @nestjs/cli

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

FROM node:22.14.0-slim
WORKDIR /usr/src/app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /usr/src/app/dist ./dist

ENV NODE_ENV=production
EXPOSE 4000
CMD ["node", "dist/src/main.js"]
