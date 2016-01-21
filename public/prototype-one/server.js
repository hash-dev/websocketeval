// Initialize StatsD module
var StatsD = require('node-statsd'),
    client = new StatsD(),
    clientCounter = 0;

var WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({ port: 8081 });

var timeToLive = 90;

printServerStatus();

setTimeout(function() {

    function doSend(data) {
        wss.broadcast(data);
    }

    (function loop() {
        var randomTimeout = getRandomTimeout();
        setTimeout(function() {
            doSend( getRandomData() );
            loop();
        }, randomTimeout);
    }());

}, 100);

wss.on('connection', function connection(ws) {

    clientCounter += 1;
    updateGauge();

    ws.on('close', function() {
        clientCounter -= 1;
        updateGauge();
    });
});

wss.broadcast = function broadcast(data) {

  wss.clients.forEach(function each(client) {
    client.send(data);
    letLiveOrLetDie(client);
  });
};

function printServerStatus() {
    console.log('started server -  listening on localhost:8081');
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

    if(connectionDuration > timeToLive) {
        client.close();
    }
}

function getRandomData() {
    var text = "";
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ";
    var randomLength = Math.floor(Math.random() * 4000) + 1;

    for( var i=0; i < randomLength; i++ )
        text += chars.charAt(Math.floor(Math.random() * chars.length));

    return text;
}

function getRandomTimeout() {
    return Math.floor(Math.random() * 10000) + 100;
}
