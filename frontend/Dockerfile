# Stage 1: Build the React app using Node.js and NPM
FROM node:18-alpine as build

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./

RUN npm ci

ADD ./public ./public
ADD ./src ./src

RUN npm run build

FROM node:18-alpine

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/build .

RUN npm install -g serve

CMD ["serve", "-s", "-l", "3000"]