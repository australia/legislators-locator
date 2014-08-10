var geoip = require('geoip-lite');
var vincenty = require('node-vincenty');
var csv = require('csv');
var fs = require('fs');

var ip = "203.206.132.243";
var geo = geoip.lookup(ip);

var clientLat = parseFloat(geo.ll[0]);
var clientLng = parseFloat(geo.ll[1]);

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