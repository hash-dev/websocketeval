var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var fs = require('fs');
var xmlParser = new require('simple-xml2json');

var app = express();
var httpServer = require('http').Server(app);

var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({ server: httpServer });

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

var sockets = [];

wss.on('connection', function(ws)
{
    if(ws.upgradeReq.url === '/stream')
    {
        sockets.push(ws);
        startPlaying();
        ws.on('close', function() {
            ws = null;
        });
    }

    if(ws.upgradeReq.url === '/pushnotification')
    {
        sockets.push(ws);
        fs.watchFile(
            __dirname + '/res/testdata/example.xml',
            {
                persistent: true,
                interval: 1000
            },
            function(curr, prev) {
                fs.readFile(__dirname + '/res/testdata/example.xml', 'utf8', function(err, data) {
                    if (err) {
                        throw err;
                    }
                    var xml = data;
                    var json = xmlParser.parser(xml);
                    ws.send(json.xml);
                });
        });
    }
});

function startPlaying()
{
    var readStream = fs.createReadStream('res/testvideos/out.mp4');
    var count = 0;

    readStream.on('data', function(data)
    {
        /*
        count++;
        console.log("Type: " + typeof data + ", Size: " + data.length);
        console.log('Sending chunk of data: ' + count);
        console.log("Sending to " + sockets.length + " sockets");
        */
        sockets.forEach(function(connection) {
            connection.send(data, { binary: true, mask: false });
        });
    });

    readStream.on('end', function() {
        console.log('ReadStream ended');
    });
}

app.get('/stream', function(req, res) {
    res.sendFile(__dirname + '/static/stream.html');
});

app.get('/idlemetadatapush', function(req, res) {
    res.sendFile(__dirname + '/static/idlemetadatapush.html');
});

app.get('/activemetadatapush', function(req, res) {
    res.sendFile(__dirname + '/static/activemetadatapush.html');
});

app.get('/pushnotification', function(req, res) {
    res.sendFile(__dirname + '/static/pushnotification.html');
});

httpServer.listen(8080, function() {
    console.log('Express server listening on port 8080.');
});