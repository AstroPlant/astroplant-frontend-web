FROM node:14.2-alpine

RUN mkdir -p /usr/src/astroplant-frontend-web
WORKDIR /usr/src/astroplant-frontend-web
COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .
COPY src ./src
COPY local_modules ./local_modules
COPY public ./public

RUN npm install
RUN (cd ./local_modules/astroplant-api && npm install && npm run build)

EXPOSE 3000

CMD ["npm", "start"]
