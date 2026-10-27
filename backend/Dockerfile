# [AWS Paso 2] Imagen del backend para ECS Express Mode.
# Diferencias con la guía (que asume un index.js en JavaScript plano):
#  - Usamos node:22 porque Node 20 ya está fuera de soporte y Prisma 7 pide Node >= 20.19.
#  - Instalamos TODAS las dependencias (no --omit=dev): el postinstall ejecuta `prisma generate`
#    (CLI en devDependencies) y el servidor corre con `tsx` porque está escrito en TypeScript.
#  - El cliente de Prisma se genera dentro de la imagen (src/generated está en .gitignore/.dockerignore).
FROM node:22-alpine
WORKDIR /app

COPY package*.json prisma.config.ts ./
COPY prisma ./prisma
RUN npm ci

COPY . .

ENV NODE_ENV=production
EXPOSE 3000
# DATABASE_URL, FRONTEND_URL y PORT se configuran como variables de entorno del servicio en ECS,
# nunca dentro de la imagen.
CMD ["npm", "start"]
