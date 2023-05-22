FROM node:lts-alpine as builder

COPY . .

RUN npm i
RUN npm run build

FROM nginx:1.23.4-alpine

COPY --from=builder nginx.conf /etc/nginx/nginx.conf
COPY --from=builder dist .

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
