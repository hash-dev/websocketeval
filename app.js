// module dependencies
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var fs = require('fs');
var xmlParser = require('simple-xml2json');

// enable usage of all available cpu cores
var cluster = require('cluster'); // required if worker id is needed
var sticky = require('sticky-session');

// enable metric recording
var StatsD = require('node-statsd'),
    client = new StatsD(),
    clientCounter = 0;

// helper vars
var timeToLive = 180; // Prototype 1 - Testcase 1
var maxMessageCount = 50,
    messageCount = 0; // Prototype 1 - Testcase 2

// init and configure express webserver
var app = express();
var httpServer = require('http').createServer(app, function(req, res) {
    res.end('worker: ' + cluster.worker.id);
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// init node server for all available cpu cores
if (!sticky.listen(httpServer, 8080)) {
    httpServer.once('listening', function() {
        console.log('Started webserver, listening to port 8080');
    });
} else {

    var WebSocketServer = require('ws').Server;
    var wss = new WebSocketServer({ server: httpServer });

    var serverId = cluster.worker.id;
    console.log('Initiate server instance ' + serverId);
    var sockets = [];

    wss.on('connection', function(ws) {
        sockets.push(ws);

        // Prototype 1 - WebSocket metadata push
        // Testcase 1 - mostly idle connections
        if (ws.upgradeReq.url === '/idlemetadatapush')
        {
            setTimeout(function() {
                function doSend(data) {
                    wss.broadcast(data, true);
                }

                (function loop() {
                    var randomTimeout = getRandomTimeout();
                    setTimeout(function() {
                        doSend(getRandomData());
                        loop();
                    }, randomTimeout);
                }());

            }, 100);

            clientCounter += 1;
            updateGauge(serverId);
            ws.connectionStart = new Date().getTime();

            ws.on('message', function(msg) {
                console.log("received: " + msg);
            });

            ws.on('close', function() {
                clientCounter -= 1;
                updateGauge(serverId);
                ws = null;
            });
        }

        // Testcase 2 - active connections
        if (ws.upgradeReq.url === '/activemetadatapush')
        {
            setTimeout(function() {
                function doSend(data) {
                    wss.broadcast(data, false);
                }

                (function loop() {
                    setTimeout(function() {
                        messageCount += 1;

                        if (messageCount >= maxMessageCount) {
                            doSend("timeToGo");
                            messageCount = 0;
                        } else {
                            doSend(getRandomData());
                        }

                        loop();
                    }, 500);
                }());

            }, 100);

            ws.on('message', function incoming(message) {
                console.log('received: %s', message);
            });

            clientCounter += 1;
            updateGauge(serverId);

            ws.on('close', function() {
                clientCounter -= 1;
                updateGauge(serverId);
            });
        }

        // Prototype 2 - WebSocket push notification
        if (ws.upgradeReq.url === '/pushnotification')
        {
            // use res/testdata/changeFile.js for automated file changing
            fs.watchFile(
                __dirname + '/res/testdata/example.xml', {
                    persistent: true,
                    interval: 1000
                },
                function(curr, prev) {
                    fs.readFile(__dirname + '/res/testdata/example.xml', 'utf8', function(err, data) {
                        if (err) {
                            throw err;
                        }

                        var json = xmlParser.parser(data);
                        if (ws.readyState == 1) {
                            ws.send(json.xml);
                        }
                    });
                });

            ws.on('close', function() {
                ws = null;
            });
        }
    });

    wss.broadcast = function broadcast(data, doLetLiveOrLetDie) {
        wss.clients.forEach(function each(client) {
            // Do not send, if client is not open
            if (client.readyState == 1) {
                client.send(data);
                if (doLetLiveOrLetDie) {
                    letLiveOrLetDie(client);
                }
            }
        });
    };
}

// routes
app.get('/', function (req,res){
  res.render('index', {
        title: 'WebSocket Evaluation',
        teaser: 'The prototypes aim to examine the capacity, performance and limits of the WebSocket protocol.'
    });
});

app.get('/idlemetadatapush', function(req, res) {
    res.render('idlemetadatapush', {
        title: 'Metadata Push',
        teaser: 'Long-lived and mostly idle connections.'
    });
});

app.get('/activemetadatapush', function(req, res) {
    res.render('activemetadatapush', {
        title: 'Metadata Push',
        teaser: 'Short-lived but highly active connections.'
    });
});

app.get('/pushnotification', function(req, res) {
    res.render('pushnotification', {
        title: 'Push Notification',
        teaser: 'A changed XML-file data causes the ws-server to update the content.'
    });
});

// functions
function logReadStreamData(data, count, socketLength)
{
    console.log("Type: " + typeof data + ", Size: " + data.length);
    console.log('Sending chunk of data: ' + count);
    console.log("Sending to " + socketLength + " sockets");
}

function printConnectionData(ws, occurrence) {
    console.log(occurrence + ' connection-' + ws._ultron.id);
}

function updateGauge(serverId) {
    client.gauge('client connections-' + serverId, clientCounter);
}

function letLiveOrLetDie(client)
{
    var d = new Date();
    connectionDuration = parseInt((d.getTime() - client.connectionStart) / 1000);

    if (connectionDuration > timeToLive) {
        client.send("timeToGo");
    }
}

function getRandomData()
{
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