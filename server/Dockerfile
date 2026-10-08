FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

EXPOSE 3001

ENV PORT=3001 \
    HOST=0.0.0.0 \
    NODE_ENV=production

CMD ["npm", "start"]
