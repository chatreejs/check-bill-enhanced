FROM node:14-alpine AS build

ARG BASE_HREF=/

WORKDIR /app
COPY package.json ./package.json
RUN npm install

COPY . /app
RUN npm run ng -- build --configuration production --base-href $BASE_HREF

FROM nginx:alpine
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /usr/share/nginx/html
