FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm cache clean --force && npm install

COPY . .

EXPOSE 5173
CMD ["npm", "run", "dev"]