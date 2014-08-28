module.exports = function latLngToPostcode(clientLat, clientLng, callback) {
var nearestData = {
    distance: 99999999999999999999
};
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