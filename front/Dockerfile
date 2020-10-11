FROM node:lts-buster
RUN mkdir /client
WORKDIR /client
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm","run", "serve"]
