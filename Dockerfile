FROM node:16

WORKDIR /usr/src/cnts

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8888

ENV NODE_ENV=production

CMD ["node", "app.js"]
