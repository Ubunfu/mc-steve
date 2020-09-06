FROM node:14-alpine

COPY . /app
WORKDIR /app
RUN rm .env

ENTRYPOINT [ "npm", "run", "start"]