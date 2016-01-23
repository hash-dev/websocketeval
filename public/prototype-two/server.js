var app = require('http').createServer(handler),
    io = require('socket.io').listen(app),
    parser = new require('xml2json'),
    fs = require('fs');

// create server
app.listen(8080);

console.log('started server -  listening on localhost:8080');

// on server start load client.html
function handler(req, res) {
    fs.readFile(__dirname + 'client.html', function(err, data) {
        if (err) {
            console.log(err);
            res.writeHead(500);
            return res.end('Error loading client.html');
        }
        res.writeHead(200);
        res.end(data);
    });
}

// creating a new websocket-connection to keep the content updated without any AJAX request
io.sockets.on('connection', function(socket) {
    console.log(__dirname);

    //watching the xml file
    fs.watchFile(__dirname + '/example.xml', {
        persistent: true,
        interval: 1000
    }, function(curr, prev) {
        // on file change read the new xml
        fs.readFile(__dirname + '/example.xml', function(err, data) {
            if (err) throw err;

            // parsing the new xml data and converting it into json file
            var json = parser.toJson(data);
            // send the new data to the client
            socket.volatile.emit('notification', json);
        });
    });
});
