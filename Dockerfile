# 1. Imagen base ligera
FROM node:20-alpine

# 2. Directorio de trabajo
WORKDIR /app

# 3. Copia package.json y lockfile, luego instala deps
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm \
  && pnpm install --frozen-lockfile --prod

# 4. Copia todo y genera build
COPY . .
RUN pnpm build

# 5. Exponer puerto
EXPOSE 3000

# 6. Arrancar tu servidor Next con medición de memoria
CMD ["node", "server.js"]
