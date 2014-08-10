var fs = require('fs');
var finalArray = [];

fs.readFile('./postcodeLatLng.csv', function(err, data) {
    if (err) throw err;
    var rows = data.toString().split("\n");
    for (i in rows) {

        var cells = rows[i].split(",");
        var postcode = cells[0];
        var lat = cells[5] && parseFloat(cells[5].replace("\"", ""));
        var lng = cells[6] && parseFloat(cells[6].replace("\"", ""));

        finalArray.push({
            postcode: postcode,
            lat: lat,
            lng: lng
        });
    }
    fs.writeFileSync('./postcodeLatLng.json', JSON.stringify(finalArray));
});

//used for generating the postcodeLatLng.json file