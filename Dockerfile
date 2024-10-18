FROM node:16.14.0

RUN npm install -g ts-node

WORKDIR /usr/src/app

COPY *.json ./
COPY *.js ./
COPY *.env ./

COPY . .

RUN npm install

EXPOSE 3000

CMD ["npm","start"]