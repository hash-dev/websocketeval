FROM ubuntu:14.04

RUN apt-get update && apt-get install -y \
	nodejs-legacy \
	npm \
	php5 \
	vim

# Bundle app source
COPY . /src

# Install app dependencies
RUN cd /src/server; npm install

EXPOSE 8000

CMD ["node", "/src/server/server.js"]
