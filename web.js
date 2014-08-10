var express = require('express');
var vincenty = require('node-vincenty');
var csv = require('csv');
var fs = require('fs');
var request = require('superagent');

var app = express();

var cachedLegislators = {};

var nearestData = {
    distance: 99999999999999999999
};

var openAusAPIKey = process.env.API;

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

function getLegislators(postcode, type, callback) {
    var repsObj = {};

    if (postcode in cachedLegislators) {
        console.log('using cached legislator data...');
        callback(cachedLegislators[postcode]);
        return;
    }

    request.get("http://www.openaustralia.org/api/" + type + "?key=" + openAusAPIKey + "&output=js&postcode=" + postcode, function(response) {

        if (JSON.parse(response.text).error === "Invalid postcode" || JSON.parse(response.text).error === "Unknown postcode") {
            callback(response.text);
            return;
        }

        try {
            var legislators = JSON.parse(response.text);
        } catch (e) {
            callback({
                errror: e
            });
            return;
        }

        if (Object.prototype.toString.call(legislators) !== '[object Array]') {
            callback({
                errror: "no data returned."
            });
            return;
        }

        // if (legislators.length < 3){
        //     getLegislators(postcode, 'getSenators', function(senatorsObj){

        //     }};
        // }

        legislators.forEach(function(rep) {
            repsObj[rep.member_id] = {
                member_id: rep.member_id,
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
        getLegislators(req.query.postcode, 'getRepresentatives', function(repsObj) {
            res.jsonp(repsObj);
        });
    } else if (req.query.lat && req.query.lng) {
        latLngToPostcode(parseFloat(req.query.lat), parseFloat(req.query.lng), function(postcode) {
            getLegislators(postcode, 'getRepresentatives', function(repsObj) {
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

// lat lng is in aus else

// if outside aus use our postcode


function isInAustralia(postcode, lat, lng) {

}