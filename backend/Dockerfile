FROM node:18-alpine

WORKDIR /usr/src/app

COPY . .

ENV NODE_ENV production

RUN npm ci --omit=dev

RUN npm run build

EXPOSE 5000

USER node

CMD ["npm", "run", "start:prod"]