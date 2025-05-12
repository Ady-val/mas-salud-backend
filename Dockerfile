FROM node:22.14.0-slim AS builder
WORKDIR /usr/src/app

# Instalar pnpm y Nest CLI globalmente
RUN npm install -g pnpm @nestjs/cli

# Copiar solo el manifest y lockfile antes de instalar deps
COPY package.json pnpm-lock.yaml ./

# Instalar todas las dependencias (incluye devDependencies)
RUN pnpm install --frozen-lockfile

# Copiar el resto del código fuente
COPY . .

# Verificar que nest CLI esté disponible y compilar la aplicación
RUN nest --version && pnpm run build

# Stage 2: Runtime
FROM node:22.14.0-slim
WORKDIR /usr/src/app

# Instalar pnpm para producción (no necesitamos CLI)
RUN npm install -g pnpm

# Copiar manifest y lockfile para instalar solo prod deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile
RUN pnpm build

# Copiar el bundle compilado desde builder
COPY --from=builder /usr/src/app/dist ./dist

# Definir entorno de producción
ENV NODE_ENV=production

# Exponer el puerto donde correrá la app
EXPOSE 4000

# Arrancar el bundle compilado
CMD ["node", "dist/main.js"]