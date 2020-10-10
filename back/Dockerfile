FROM node:12.18-alpine3.12
RUN mkdir /back
WORKDIR /back
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001
CMD ["npm","start"]
