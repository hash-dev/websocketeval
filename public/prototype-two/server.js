var getIP = require('external-ip')();
 
getIP(function (err, ip) {
    if (err) {
        // every service in the list has failed 
        throw err;
    }
    console.log(ip);
});

var WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({ port: 8081 });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

  setInterval(function() {
        ws.send(String(getRandomNumber()));
    }, 1000);
});

function getRandomNumber() {
    return Math.floor((Math.random() * 1000) + 1);
}
