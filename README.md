# websocketeval

This project includes small websocket prototypes aimed to examine the capacity, performance and limits of the WebSocket protocol. 

The lib-folder contains the prototypes including server- and potential client-js files, which can be used for an HTML client stub.

The tesplans-folder contains JMeter testplans for the prototype's relating testcases.

## Prerequisites

* npm

## Usage

* Clone the project or download the .zip-archive
* Change into the root-directory
* Install the necessary dependencies via npm:

```
npm install
```

## Prototypes

### Prototype-One 

Arbitrary Data Serverpush - a simple ws-server: random text data is being pushed to the client.

#### Testcase 1

JMeter-Testplan: Long-lived and mostly idle connections. The number of connections varies from 1,000 to 50,000, message size from 10 to 4096 bytes, and the frequency of messages from 0.1 to 10 seconds. 

#### Testcase 2

JMeter-Testplan: Short-lived but highly active connections. The number of concurrent connections is constant at 500, with 50 messages per connection and no delay between messages. Message size ranged from 1 to 4096 bytes.

### Prototype-Two

Push Notification Server - a simple socket.io-server: changed data is being pushed to the client. Folder also includes a small js-script that automatically changes the xml-file every second.