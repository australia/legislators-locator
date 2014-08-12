var request = require('superagent');
var openAusAPIKey = process.env.API;

var randomProperty = function(obj) {
    var keys = Object.keys(obj)
    return obj[keys[keys.length * Math.random() << 0]];
};

function getLegislators(postcode, callback) {
    var legislatorsObject = {};

    getSomeLegislators(postcode, 'getRepresentatives', function(RepresentativesObj) {
        legislatorsObject = RepresentativesObj;

        if (Object.keys(legislatorsObject).length < 3) {

            getSomeLegislators(postcode, 'getSenators', function(senatorsObj) {

                for (var i = 0; i <= (3 - Object.keys(legislatorsObject).length); i++) {

                    var randomSenator = randomProperty(senatorsObj);
                    legislatorsObject[randomSenator.member_id] = randomSenator;

                };

                callback(legislatorsObject);

            });
        } else {
            callback(legislatorsObject);
        }
    });
}

function getSomeLegislators(postcode, type, callback) {
    var repsObj = {};

    // if (postcode in cachedLegislators) {
    //     console.log('using cached legislator data...');
    //     callback(cachedLegislators[postcode]);
    //     return;
    // }

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

        // cachedLegislators[postcode] = repsObj;
        console.log('esle');
        callback(repsObj);

    });
}
module.exports = getLegislators;