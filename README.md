# websocketeval

This project includes a Dockerfile for building the related image and src-files for the websocket-evaluation prototypes. You don't necessarily need to run the docker container and can use the prototypes as stand-alone.

So far there is the 'prototype-one' which simply pushes information to all connected clients, if the data in the example.xml has changed. A php-script changes the xml-file every second as long as it runs.

## Prerequisites

* npm and bower (and docker, if you want to use it)  installed globally

## Usage

* Clone the project or download the .zip-archive
* Change into the root-directory
* Install the necessary npm and bower dependencies:

```
npm install
bower install
```

* Build the docker-image:

```
docker build -t imageprefix/imagesuffix:tag path/to/Dockerfile
```

* After the build run the container:

```
docker run -d -p 8080:8080 -v $PWD:/root imageprefix/imagesuffix:tag
```

* The container is now running in detached mode (in the background) and the ws-server is already running
* Also start the php-script for simulating the changing data (get the container-name via the command "docker ps"):

```
docker exec -d container-name php /root/prototype-one/changeFile.php
```

* In your browser open the file "prototype-one/client.html" and you should see data updates every second
