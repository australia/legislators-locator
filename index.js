var express = require('express');
var vincenty = require('node-vincenty');
var csv = require('csv');
var fs = require('fs');

var app = express();
// examples
clientLat = -27.530157;
clientLng = 153.040116;

var nearestData = {
    distance: 99999999999999999999
}


fs.readFile('./postcodeLatLng.csv', function(err, data) {
    if (err) throw err;
    var rows = data.toString().split("\n");
    for (i in rows) {

        var cells = rows[i].split(",");
        var postcode = cells[0];
        var lat = cells[5] && parseFloat(cells[5].replace("\"", ""));
        var lng = cells[6] && parseFloat(cells[6].replace("\"", ""));

        vincenty.distVincenty(clientLat, clientLng, lat, lng, function(distance) {
            if (nearestData.distance > distance) {
                // console.log(distance);
                nearestData = {
                    postcode: postcode,
                    distance: distance
                };
            }
        });


    }
    console.log(nearestData);
});

app.get('/', function(req, res) {
    res.send('hello  world');
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
    console.log('Listening on ' + port);
});