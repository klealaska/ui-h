FROM --platform=linux/amd64 node:16-alpine as build
# Installing libvips-dev for sharp Compatability
RUN apk update && apk add build-base gcc autoconf automake zlib-dev libpng-dev vips-dev && rm -rf /var/cache/apk/* > /dev/null 2>&1
WORKDIR /app
COPY ./dist/apps/cms/cms-bff .
COPY ./package.json .
ENV PORT=4444
EXPOSE ${PORT}
RUN npm install --production --force
# dependencies that nestjs needs
RUN npm install reflect-metadata tslib rxjs @nestjs/platform-express --force
COPY . /app
USER node
CMD node ./main.js
