FROM node:14

COPY . /app
WORKDIR /app
RUN rm .env

ENTRYPOINT [ "npm", "run", "start"]