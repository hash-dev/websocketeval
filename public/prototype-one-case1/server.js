var cluster = require('cluster'); // required if worker id is needed
var sticky = require('sticky-session');

var StatsD = require('node-statsd'),
    client = new StatsD(),
    clientCounter = 0;

var server = require('http').createServer(function(req, res) {
  res.end('worker: ' + cluster.worker.id);
});

if (!sticky.listen(server, 3000)) {

    server.once('listening', function() {
        console.log('Started sticky server listening to port 3000');
    });
} else {

    var WebSocketServer = require('ws').Server;
    var wss = new WebSocketServer({
        port: 8081
    });
    var serverId = cluster.worker.id;

    var timeToLive = 90;

    printServerStatus();

    setTimeout(function() {

        function doSend(data) {
            wss.broadcast(data);
        }

        (function loop() {
            var randomTimeout = getRandomTimeout();
            setTimeout(function() {
                doSend(getRandomData());
                loop();
            }, randomTimeout);
        }());

    }, 100);

    wss.on('connection', function connection(ws) {

        clientCounter += 1;
        updateGauge(serverId);

        ws.on('message', function(msg) {
            console.log("received: " + msg);
        });

        ws.on('close', function() {
            clientCounter -= 1;
            updateGauge(serverId);
        });
    });

    wss.broadcast = function broadcast(data) {

        wss.clients.forEach(function each(client) {
            // Do not send, if client is not open
            if (client.readyState == 1) {
                client.send(data);
                letLiveOrLetDie(client);
            }
        });
    };
}

function printServerStatus() {
    console.log('Started ws-server, testcase 1 - listening on port 8081');
}

function printConnectionData(ws, occurrence) {
    console.log(occurrence + ' connection-' + ws._ultron.id);
}

function updateGauge(serverId) {
    client.gauge('client connections-' + serverId, clientCounter);
}

function letLiveOrLetDie(client) {
    var d = new Date();
    connectionDuration = parseInt((d.getTime() - client._socket._idleStart) / 1000);

    if (connectionDuration > timeToLive) {
        client.close();
    }
}

function getRandomData() {
    var text = "";
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ";
    var randomLength = Math.floor(Math.random() * 4000) + 1;

    for (var i = 0; i < randomLength; i++)
        text += chars.charAt(Math.floor(Math.random() * chars.length));

    return text;
}

function getRandomTimeout() {
    return Math.floor(Math.random() * 10000) + 100;
}
