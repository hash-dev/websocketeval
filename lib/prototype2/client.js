(function() {

    // create websocket
    var socket = io.connect('http://localhost:8083');

    // print the new data
    socket.on('notification', function(data) {
        var _data = JSON.parse(data);

        $('#container').html(_data.test.sample);
        $('time').html('Last Update: ' + new Date());
    });

})();