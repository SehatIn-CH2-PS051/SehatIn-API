FROM node:20-slim
WORKDIR /sehatin-api
COPY package*.json ./
RUN npm install
COPY . .
ENV PORT=8080
EXPOSE 8080
CMD [ "node", "./src/index.js" ]