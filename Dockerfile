# Builds the backend server
FROM node:10-alpine

WORKDIR /usr/src/app

COPY packages/printmon-server/package.json yarn.lock ./

RUN yarn install

COPY packages/printmon-server/ .

RUN yarn build

EXPOSE 4005

CMD ["yarn", "start"]