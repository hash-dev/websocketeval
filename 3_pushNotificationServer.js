var app = require('http').createServer(handler),
    io = require('socket.io').listen(app),
    parser = new require('xml2json'),
    fs = require('fs');

// create server
app.listen(8083);
console.log('started socket.io-server - listening on port 8083');

// on server start load client-html script
function handler(req, res) {
    fs.readFile(__dirname + '/../index.html', function(err, data) {
        if (err) {
            console.log(err);
            res.writeHead(500);
            return res.end('Error loading index.html');
        }
        res.writeHead(200);
        res.end(data);
    });
}

// creating a new websocket-connection to keep the content updated without any AJAX request
io.sockets.on('connection', function(socket) {

    //watching the xml file
    fs.watchFile(__dirname + '/example.xml', {
        persistent: true,
        interval: 1000
    }, function(curr, prev) {
        // on file change read the new xml
        fs.readFile(__dirname + '/example.xml', function(err, data) {
            if (err) {
                throw err;
            }

            var json = parser.toJson(data);
            // send data to client
            socket.volatile.emit('notification', json);
        });
    });
});
