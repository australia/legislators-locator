var express = require('express');
var vincenty = require('node-vincenty');
var csv = require('csv');
var fs = require('fs');

var getLegislators = require('./getLegislators');

var app = express();

var cachedLegislators = {};

var nearestData = {
    distance: 99999999999999999999
};

function latLngToPostcode(clientLat, clientLng, callback) {
    fs.readFile('./postcodeLatLng.json', function(err, array) {
        if (err) throw err;

        JSON.parse(array).forEach(function(obj) {

            vincenty.distVincenty(clientLat, clientLng, obj.lat, obj.lng, function(distance) {
                if (nearestData.distance > distance) {
                    nearestData = {
                        postcode: obj.postcode,
                        distance: distance
                    };
                }
            });
        });
        callback(nearestData.postcode);
    });
}

app.get('/', function(req, res) {
    if (req.query.postcode) {
        getLegislators(req.query.postcode, function(repsObj) {
            res.jsonp(repsObj);
            return;
        });

    } else if (req.query.lat && req.query.lng) {
        var lat = parseFloat(req.query.lat);
        var lng = parseFloat(req.query.lng);

        if (lat > -10.41 || lat < -39.08 || lng < 113.09 || lng > 153.38) { // is in aus
            // res.jsonp({
            //     error: 'not in australia'
            // });

            getLegislators(4121, function(repsObj) { //test
                res.jsonp(repsObj);
            });
            return;
        }

        latLngToPostcode(lat, lng, function(postcode) {
            getLegislators(postcode, function(repsObj) {
                res.jsonp(repsObj);
                return;
            });
        });
    }
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
    console.log('Listening on ' + port);
});

// todo convert lat lng to postcode