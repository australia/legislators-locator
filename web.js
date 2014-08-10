var express = require('express');
var vincenty = require('node-vincenty');
var csv = require('csv');
var fs = require('fs');
var request = require('superagent');

var app = express();

var cachedLegislators = {};

var nearestData = {
    distance: 99999999999999999999
}

var openAusAPIKey = process.env.API;

function latLngToPostcode(clientLat, clientLng, callback) {
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

function getRepresentatives(postcode, callback) {

    if (postcode in cachedLegislators) {
        callback(cachedLegislators[postcode]);
        return;
    }

    request.get("http://www.openaustralia.org/api/getRepresentatives?key=" + openAusAPIKey + "&output=js&postcode=" + postcode, function(response) {
        var repsObj = {};
        JSON.parse(response.text).forEach(function(rep) {
            repsObj[rep.member_id] = {
                house: rep.house,
                first_name: rep.first_name,
                last_name: rep.last_name,
                constituency: rep.constituency,
                party: rep.party,
                entered_house: rep.entered_house,
                left_house: rep.left_house,
                entered_reason: rep.entered_reason,
                left_reason: rep.left_reason,
                person_id: rep.person_id,
                title: rep.title,
                lastupdate: rep.lastupdate,
                full_name: rep.full_name,
                name: rep.name,
                image: rep.image
            }
        });
        cachedLegislators[postcode] = repsObj;

        callback(repsObj);
    });
}

app.get('/', function(req, res) {
    if (req.query.postcode) {
        getRepresentatives(req.query.postcode, function(repsObj) {
            res.jsonp(repsObj);
        });
    } else {
        latLngToPostcode(parseFloat(req.query.lat), parseFloat(req.query.lng), function(postcode) {
            getRepresentatives(postcode, function(repsObj) {
                res.jsonp(repsObj);
            });
        });
    }
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
    console.log('Listening on ' + port);
});

// todo: convert csv into json