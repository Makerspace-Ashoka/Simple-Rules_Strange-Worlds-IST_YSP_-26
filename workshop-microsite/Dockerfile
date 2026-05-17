FROM node:20-alpine AS build

WORKDIR /app

COPY workshop-microsite/package.json ./package.json
COPY workshop-microsite/yarn.lock ./yarn.lock

RUN corepack enable && yarn install --frozen-lockfile

COPY workshop-microsite/ ./

ARG SITE_URL=http://localhost
ARG BASE_URL=/

ENV SITE_URL=${SITE_URL}
ENV BASE_URL=${BASE_URL}

RUN node ./node_modules/@docusaurus/core/bin/docusaurus.mjs build

FROM nginx:1.27-alpine AS runtime

COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
