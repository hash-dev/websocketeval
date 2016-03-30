# websocketeval

This project includes small WebSockets prototypes as described below, that aim to examine the capacity, performance and limits of the WebSocket protocol. 

The **app.js** contains the serverside-components of the prototypes. The client-side equivalents can be found in **public/js**.

The **res/tesplans-folder** contains JMeter testplans for the prototype 2 relating testcases.

## Prerequisites

* npm

## Usage

* Change into the project's root-directory
* Install the necessary application dependencies via npm:

```
$ npm install
```

## Prototypes

### Metadata Serverpush - Prototype 1

A simple ws-server: random text data is being pushed to the client.

#### Testcase 1

JMeter-Testplan: Long-lived and mostly idle connections. The number of connections varies from 1,000 to 50,000, message size from 10 to 4096 bytes, and the frequency of messages from 0.1 to 10 seconds. 

#### Testcase 2

JMeter-Testplan: Short-lived but highly active connections. The number of concurrent connections is constant at 500, with 50 messages per connection and no delay between messages. Message size ranged from 1 to 4096 bytes.

### Push Notification - Prototype 2

A changed xml-file causes the ws-server to update the content. **res/testdata** includes the watched xml-file as well as a small **js-script** that automatically changes the xml-file every second - to start it change into the folde and run it with:

```
$ node changeFile.js
```
