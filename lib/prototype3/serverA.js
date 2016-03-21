var fs = require('fs');
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({ port: 8080 });
console.log('Server running and listening to port 8080');

var clients = [];

wss.on('connection', function(ws)
{
    clients.push(ws);
    startPlaying();
});

function startPlaying()
{
    var readStream = fs.createReadStream('out.mp4');
    var count = 0;

    readStream.on('data', function(data)
    {
        /*
        count++;
        console.log("Type: " + typeof data + ", Size: " + data.length);
        console.log('Sending chunk of data: ' + count);
        console.log("Sending to " + clients.length + " clients");
        */
        clients.forEach(function(client) {
            client.send(data, { binary: true, mask: false });
        });
    });

    readStream.on('end', function() {
        console.log('ReadStream ended');
    });
}