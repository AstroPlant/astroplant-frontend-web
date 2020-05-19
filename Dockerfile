FROM node:14.2-alpine

RUN mkdir -p /usr/src/astroplant-frontend-web
WORKDIR /usr/src/astroplant-frontend-web
COPY . .
RUN npm install

EXPOSE 3000

CMD ["npm", "start"]
