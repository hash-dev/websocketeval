// var host = 'ADJUST-TO-MATCH-WS-SERVER';
var socketLocation = '<script src="http://' + host + 'node_modules/socket.io/node_modules/socket.io-client/socket.io.js';

console.log(location.host);
//$('script[src="res/js/sb-admin-2.js"]').after(socketLocation);

// create websocket
var socket = io.connect('http://' + location.host + ':8080');

// on every message received print the new data inside #container
socket.on('notification', function (data) {
    // convert the json string into a valid javascript object
    var _data = JSON.parse(data);

    $('#container').html(_data.test.sample);
    $('time').html('Last Update: ' + new Date());
});