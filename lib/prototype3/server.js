var static = require('node-static');
var http = require('http');

var file = new(static.Server)();

// Use the http module's createServer function and rely on instance of node-static to serve the fiels
var app = http.createServer(function (req, res) {
    file.serve(req, res);
}).listen(8084);

var io = require('socket.io').listen(app);

console.log('started socket.io-server - listening on port 8084');

io.sockets.on('connection', function (socket) {

    // Handle 'message' messages
    socket.on('message', function (message) {
        log('S --> got message: ', message);
        socket.broadcast.to(message.channel).emit('message', message);
    });

    // Handle 'create or join' message
    socket.on('create or join', function (room) {
        var numClients = io.sockets.clients(room).length;

        log('S --> Room ' + room + ' has ' + numClients + ' cleint(s)');
        log('S --> Request to chreate or join room', room);

        // Client-Init - Two Clients MAX!
        if (numClients == 0) {
            socket.join(room);
            socket.emit('created', room);
        } else if (numClients == 1) {
            io.sockets.in(room).emit('join', room);
            socket.join(room);
            socket.emit('joined', room);
        } else {
            socket.emit('full', room);
        }
    });

    function log() {
        var array = ['>>> '];
        for (var i = 0; i < arguments.length; i++) {
            array.push(arguments[i]);
        }
        socket.emit('log', array);
    }
});