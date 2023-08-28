# Base image
FROM node:18-alpine

# Create and set working directory
RUN mkdir -p /usr/src/app/
WORKDIR /usr/src/app/

# Install and cache app dependencies
COPY . /
RUN npm install

EXPOSE 80

# start app
CMD ["npm", "start"]