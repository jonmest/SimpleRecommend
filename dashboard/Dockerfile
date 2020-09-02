# pull official base image
FROM node:13.12.0-alpine

RUN adduser node root
# set working directory
WORKDIR /home/node/app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /home/node/app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install

# add app
COPY . ./
USER 1000
# start app
CMD ["npm", "start"]    
