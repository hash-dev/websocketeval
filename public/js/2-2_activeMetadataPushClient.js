(function() {

    var output;

    function init() {
        output = document.getElementById('output2');
        testWebSocket();
    }

    function testWebSocket() {
        websocket = new WebSocket("ws://" + window.location.host + "/activemetadatapush");
        websocket.onopen = function(evt) {
            onOpen(evt);
        };
        websocket.onclose = function(evt) {
            onClose(evt);
        };
        websocket.onmessage = function(evt) {
            onMessage(evt);
        };
        websocket.onerror = function(evt) {
            onError(evt);
        };
    }

    function onOpen(evt) {
        writeToScreen('<span style="margin-left: 30px;">SERVER CONNECTION ESTABLISHED</span>');
    }

    function onClose(evt) {
        writeToScreen('<span style="margin-left: 30px;">SERVER CONNECTION SEPARATED</span>');
    }

    function onMessage(evt) {
        writeMessage('<span style="color: blue; margin-left: 30px; display: block;">Server Data: ' + evt.data + '</span>');
    }

    function onError(evt) {
        writeToScreen('<span style="color: red; margin-left: 30px;">ERROR:</span> ' + evt.data);
    }

    function writeToScreen(message) {
        var pre = document.createElement('p');
        pre.style.wordWrap = 'break-word';
        pre.innerHTML = message;
        output.appendChild(pre);
    }

    function writeMessage(message) {
        var pre = document.createElement('p');
        pre.setAttribute('id', 'server-data2');
        var oldPre = document.getElementById('server-data2');
        pre.style.wordWrap = 'break-word';
        pre.innerHTML = message;
        output.replaceChild(pre, oldPre);
    }

    window.addEventListener('load', init, false);

})();