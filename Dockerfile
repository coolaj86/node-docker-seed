# Node 16 was chosen only because it's the current LTS
FROM node:16-slim as base

WORKDIR /app

COPY ./package*.json ./

# Only runs if the above changed
RUN npm ci --only=production

FROM base as hubapi

COPY ./ ./

EXPOSE 3000

CMD [ "npm", "run", "start" ]
