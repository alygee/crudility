FROM nginx:1-alpine

LABEL maintainer="Sergey Li <sli@fix.ru>"

EXPOSE 17001

COPY ssl/ /etc/ssl
COPY nginx.conf /etc/nginx/
COPY dist/ /dist
