var express = require('express');
var vincenty = require('node-vincenty');
var csv = require('csv');
var fs = require('fs');
var request = require('superagent');

var app = express();
// examples
clientLat = -27.530157;
clientLng = 153.040116;

var nearestData = {
    distance: 99999999999999999999
}

var openAusAPIKey = process.env.API;


function latLngToPostcode(lat, lng, callback) {
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
        callback(nearestData.postcode);
    });
}

app.get('/', function(req, res) {

    latLngToPostcode(req.query.lat, req.query.lng, function(postcode) {
        console.log(postcode);
        request.get("http://www.openaustralia.org/api/getRepresentatives?key=" + openAusAPIKey + "&output=js&postcode=" + postcode, function(response) {
            res.send(response.text);
        });

    });





});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
    console.log('Listening on ' + port);
});