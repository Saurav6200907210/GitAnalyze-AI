FROM node:22-alpine

RUN apk add --no-cache curl

WORKDIR /app

COPY package*.json ./ 

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]