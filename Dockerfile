FROM node:18-alpine

RUN mkdir -p /usr/src/astroplant-frontend-web
WORKDIR /usr/src/astroplant-frontend-web
COPY package.json .
COPY yarn.lock .
COPY tsconfig.json .
COPY astroplant-api ./astroplant-api
COPY astroplant-frontend ./astroplant-frontend

RUN yarn install

EXPOSE 5173

CMD ["yarn", "start"]
