(function() {

    var ws = new WebSocket("ws://" + window.location.host + "/pushnotification");

    ws.onmessage = function(message)
    {
        document.getElementById('container').innerHTML = message.data;
        document.getElementById('time').innerHTML = 'Last Update: ' + new Date();
    };

})();