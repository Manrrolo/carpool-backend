FROM node:14

WORKDIR /carpool-app
COPY package.json .
RUN npm install
COPY . .
CMD npm start