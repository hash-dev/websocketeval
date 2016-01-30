var fs = require('fs');

console.log('Updating File');

var file = '/example.xml';
var pattern = /Random Data: \d+/gim;

setInterval(function() {
    readWriteAsync();
}, 1000);

function readWriteAsync() {
    var randomInt = Math.floor(Math.random() * 1000) +1;
    var replacementString = 'Random Data: ' + randomInt;

    fs.readFile(__dirname + file, 'utf-8', function(err, data) {
        if(err) throw err;

        var newValue = data.replace(pattern, replacementString);

        fs.writeFile(__dirname + file, newValue, 'utf-8', function (err) {
            if(err) throw err;
        });
    });
}