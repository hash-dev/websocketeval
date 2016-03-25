# websocketeval

This project includes small websocket prototypes as described below, that aim to examine the capacity, performance and limits of the WebSocket protocol. 

The **app.js** contains the serverside-components of the prototypes. The client-side equivalents can be found in **public/js**.

The **res/tesplans-folder** contains JMeter testplans for the prototype 2 relating testcases.

## Prerequisites

* npm
* ffmpeg
* mp4box

## Usage

* Change into the project's root-directory

* Install the necessary application dependencies via npm:

```
$ npm install
```

## Prototypes

### WS-Videostream - Prototype 1

Video-Stream Server over WebSockets - video is being played on the client side via the MediaSource-Plugin provided by the browser - **the Firefox-API has been used**.

Webcam-Capture command (segments are produced automatically):

```
$ ffmpeg -f qtkit -i "default" webcamout.mpg -map 0 -f ssegment -segment_list playlist.m3u8 -segment_list_flags +live -segment_time 10 webcam_part%03d.mpg
```

### Metadata Serverpush - Prototype 2 

A simple ws-server: random text data is being pushed to the client.

#### Testcase 1

JMeter-Testplan: Long-lived and mostly idle connections. The number of connections varies from 1,000 to 50,000, message size from 10 to 4096 bytes, and the frequency of messages from 0.1 to 10 seconds. 

#### Testcase 2

JMeter-Testplan: Short-lived but highly active connections. The number of concurrent connections is constant at 500, with 50 messages per connection and no delay between messages. Message size ranged from 1 to 4096 bytes.

### Push Notification - Prototype 3

A changed xml-file causes the ws-server to update the content. **res/testdata** includes the watched xml-file as well as a small js-script that automatically changes the xml-file every second.