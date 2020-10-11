FROM node:lts-buster
RUN mkdir /client
WORKDIR /client
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 3000
CMD ["node", "/client/node_modules/serve/bin/serve.js", "/client/build", "-p", "3000"]
