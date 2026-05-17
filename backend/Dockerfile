FROM node:20-alpine AS build

WORKDIR /app

COPY backend/package.json ./package.json
COPY backend/package-lock.json ./package-lock.json

RUN npm ci

COPY backend/tsconfig.json ./tsconfig.json
COPY backend/src ./src

RUN npm run build

FROM node:20-alpine AS runtime

WORKDIR /app
ENV NODE_ENV=production

COPY backend/package.json ./package.json
COPY backend/package-lock.json ./package-lock.json

RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist
COPY backend/src/schema.sql ./src/schema.sql

EXPOSE 3001

CMD ["node", "dist/index.js"]
