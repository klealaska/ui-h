FROM node:16-alpine
WORKDIR /app
COPY apps/bank-account-mgmt/bank-account-mgmt-api .
ENV PORT=3333
EXPOSE ${PORT}
RUN npm install --production --force
# dependencies that nestjs needs
RUN npm install reflect-metadata tslib rxjs @nestjs/platform-express --force
COPY . /app
USER node
CMD node ./main.js