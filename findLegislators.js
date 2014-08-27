var request = require('superagent');
var openAusAPIKey = process.env.API;
var contactInfo = require('./contactInfoByMemberId.json');

var randomProperty = function(obj) {
    var keys = Object.keys(obj)
    return obj[keys[keys.length * Math.random() << 0]];
};

function postcode_to_state(postcode) {
    if ((postcode >= 2600 && postcode <= 2618) || (String(postcode).substring(0, 2) == '29')) {
        return 'ACT';
    } else if (String(postcode).charAt(0) == '2') {
        return 'NSW';
    } else if (String(postcode).charAt(0) == '3') {
        return 'Victoria';
    } else if (String(postcode).charAt(0) == '4') {
        return 'Queensland';
    } else if (String(postcode).charAt(0) == '5') {
        return 'SA';
    } else if (String(postcode).charAt(0) == '6') {
        return 'WA';
    } else if (String(postcode).charAt(0) == '7') {
        return 'Tasmania';
    } else if (String(postcode).charAt(0) == '8' || String(postcode).charAt(0) == '9') {
        return 'NT';
    }
}

function findLegislators(postcode, callback) {
    var legislatorsObject = {};

    getLegislators(postcode, 'getRepresentatives', function(RepresentativesObj) {
        legislatorsObject = RepresentativesObj;

        if (Object.keys(legislatorsObject).length < 3) {

            getLegislators(postcode, 'getSenators', function(senatorsObj) {

                for (var i = 0; i <= (3 - Object.keys(legislatorsObject).length); i++) {

                    var randomSenator = randomProperty(senatorsObj);
                    console.log(randomSenator);
                    legislatorsObject[randomSenator.member_id] = randomSenator;

                };

                callback(legislatorsObject);

            });
        } else {
            callback(legislatorsObject);
        }
    });
}

function getLegislators(postcode, type, callback) {
    var openAusUrl = "http://www.openaustralia.org/api/" + type + "?key=" + openAusAPIKey + "&output=js&postcode=" + postcode;
    var repsObj = {};

    if (type === 'getSenators') {
        openAusUrl = "http://www.openaustralia.org/api/" + type + "?key=" + openAusAPIKey + "&output=js&state=" + postcode_to_state(postcode);
    }

    // if (postcode in cachedLegislators) {
    //     console.log('using cached legislator data...');
    //     callback(cachedLegislators[postcode]);
    //     return;
    // }

    request.get(openAusUrl, function(response) {

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
                image: rep.image,
                contact_details: contactInfo[rep.member_id]
            }
        });

        // cachedLegislators[postcode] = repsObj;
        callback(repsObj);

    });
}
module.exports = findLegislators;