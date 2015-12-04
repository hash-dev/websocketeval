// Get public IP-address
var getIP = require('external-ip')();

getIP(function (err, ip) {
    if (err) {
        // every service in the list has failed
        throw err;
    }
    console.log(ip);
});

// Initialize StatsD module
var StatsD = require('node-statsd'),
      client = new StatsD();

var WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({ port: 8081 });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

  // On every connection increment the StatsD-connection-value
  client.increment('client-connection');

  ws.on('open', function open() {
        console.log('ws connection open');
  });

  ws.on('close', function close() {
        console.log('ws connection closed');
        // client.decrement('client-connection');
  });

  // Send a random number every second as long as the connection persists
  setInterval(function() {
        ws.send(String(getRandomNumber()));
    }, 1000);
});

function getRandomNumber() {
    return Math.floor((Math.random() * 1000) + 1);
}
