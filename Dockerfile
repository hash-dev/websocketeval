FROM ubuntu:14.04

# Install necessary software
RUN apt-get update && apt-get install -y \
	nodejs-legacy \
	php5 \
	npm \
	vim

# Bundle app source
#COPY ./src /websocketeval/

# Install app dependencies
CMD ["cd", "/websocketeval/server/"]
CMD ["npm", "install"]
