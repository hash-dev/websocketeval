FROM ubuntu:14.04

RUN apt-get install vim
	&& apt-get install php5
	&& apt-get install nodejs-legacy
	&& apt-get install npm

# Bundle app source
COPY . /src

# Install app dependencies
RUN cd /src/server; npm install

EXPOSE 8080

CMD ["node", "/src/client/index.js"]
