var express = require('express');
var vincenty = require('node-vincenty');
var csv = require('csv');
var fs = require('fs');
var latLngToPostcode = require('./lib/latLngToPostcode');
var findLegislators = require('./lib/findLegislators');

var cachedLegislators = {};
var app = express();

app.get('/', function(req, res) {
    if (req.query.postcode) {
        findLegislators(req.query.postcode, function(repsObj) {
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

            findLegislators(4121, function(repsObj) { //test
                res.jsonp(repsObj);
            });
            return;
        }

        latLngToPostcode(lat, lng, function(postcode) {
            findLegislators(postcode, function(repsObj) {
                res.jsonp(repsObj);
                return;
            });
        });
    } else {
        res.send('nothing');
    }
});

app.get('/count', require('./count'));

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
    console.log('Listening on ' + port);
});