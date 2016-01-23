const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
console.log("numCPUs: " + numCPUs);

// Initialize StatsD module
var StatsD = require('node-statsd'),
    client = new StatsD(),
    clientCounter = 0;

var WebSocketServer = require('ws').Server;

if (cluster.isMaster) {
    // Fork workers.
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
        console.log("forking");
    }

    cluster.on('exit', function(worker, code, signal) {
        console.log('worker ${worker.process.pid} died');
    });

    cluster.on('message', function(worker, message) {
        console.log('worker ${worker.process.pid} received data: ${message}');
    })
} else if (cluster.isWorker) {

    var wss = new WebSocketServer({
        port: 8081
    });

    var timeToLive = 90;

    printServerStatus(cluster);

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
        updateGauge();

        ws.on('message', function(msg) {
            console.log("received: " + msg);
        })

        ws.on('close', function() {
            clientCounter -= 1;
            updateGauge();
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

function printServerStatus(cluster) {
    console.log('Started ws-server, testcase 1 - listening on port 8081');
    console.log('Worker-ID: ' + cluster.worker.id);
}

function printConnectionData(ws, occurrence) {
    console.log(occurrence + ' connection-' + ws._ultron.id);
}

function updateGauge() {
    client.gauge('client connections', clientCounter);
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
