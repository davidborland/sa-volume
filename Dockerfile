# Base image
FROM node:12.22.12-alpine

# Create and set working directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# Environment variables
ENV NODE_VERSION 12.22.12

# Install and cache app dependencies
COPY package*.json ./
RUN npm install

COPY public ./public
COPY src ./src

EXPOSE 80

# start app
CMD ["npm", "start"]