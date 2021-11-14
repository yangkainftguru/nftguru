FROM node:10

# Create app directory
WORKDIR /usr/src/app

# Install python
RUN apt-get update

# Install app dependencies
COPY package*.json ./

RUN npm install --only=prod
# If you are building your code for production
RUN npm i -s fs

# Bundle app source
COPY . .

# Build app source
RUN npm run build

CMD npm run start:prod