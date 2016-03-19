var fs = require('fs');
var throttle = require('throttle');

var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({ port: 8080, host: "127.0.0.1" });

var clients = [];

var firstChunk;

wss.on('connection', function(ws) {
    clients.push(ws);

    startPlaying();
});

function startPlaying() {
    var bit_rate = (11427840 * 8) / 179;
    // stream file
    //var readStream = fs.createReadStream("small.webm").pipe(new throttle((bit_rate / 10) * 1.2));
    var readStream = fs.createReadStream("univac.webm");

    var count = 0;
    readStream.on('data', function(data) {
        count++;
        /*
        console.log("Type: " + typeof data + ", Size: " + data.length);
        console.log('Sending chunk of data: ' + count);
        console.log("Sending to " + clients.length + " clients");
        */
        clients.forEach(function(client) {
            client.send(data, { binary: true, mask: false });
        });
    });

    readStream.on('end', function() {
        console.log("END");
    });
}

console.log('Server running at http://127.0.0.1:8080/');