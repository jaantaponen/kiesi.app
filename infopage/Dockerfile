FROM node:12.18-alpine3.12
RUN mkdir /info
WORKDIR /info
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3003
CMD ["npm","run", "serve"]
