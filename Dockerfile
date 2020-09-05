FROM node:12.3.1 AS builder

WORKDIR /tmp
COPY . .
RUN npm install typescript -g && npm install

FROM node:12.3.1-alpine

RUN mkdir -p /app/{node_modules,dist}
WORKDIR /app
COPY --from=builder /tmp/node_modules ./node_modules
COPY . .

EXPOSE 3000

ENTRYPOINT ["npm", "start"]
