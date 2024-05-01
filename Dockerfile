FROM node:18 AS builder
WORKDIR /home/node/app
COPY . .
ENV REACT_APP_API_ORIGIN=http://web-service/api
RUN npm install
RUN npm run build:prod
FROM nginx:latest
WORKDIR /usr/share/nginx/html
COPY --from=builder /home/node/app/dist .
COPY nginx.conf                                 /etc/nginx/conf.d/default.conf
COPY /public/assets                             ./assets
EXPOSE 8080