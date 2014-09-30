var request = require('superagent');
var openAusAPIKey = process.env.API;
var contactInfo = require('./contactInfoByMemberId.json');
var postcode_to_state = require('./postcode_to_state');

var randomProperty = function(obj) {
    var result;
    var count = 0;
    for (var prop in obj) {
        if (Math.random() < 1/++count) {
           result = prop;
           console.log(prop);
        }
    }
    return obj[result];
};

var cachedSenators = {};
var cachedRepresentatives = {};

function findLegislators(postcode, callback) {
    var legislatorsObject = {};

    getLegislators(postcode, 'getRepresentatives', function(RepresentativesObj) {
        legislatorsObject = RepresentativesObj;
        if(legislatorsObject !== null) {

            if (Object.keys(legislatorsObject).length < 3) {
                console.log('less than 3', Object.keys(legislatorsObject).length );
                getLegislators(postcode, 'getSenators', function(senatorsObj) {
                    while (Object.keys(legislatorsObject).length < 3) {
                        var randomSenator = randomProperty(senatorsObj);
                        legislatorsObject[randomSenator.member_id] = randomSenator;
                    };
                    callback(legislatorsObject);
                });
                return;
            } else {
                callback(legislatorsObject);
            }
        } else {
            // something wrong happened
            callback({});
        }
    });
}

function formatLegislators(legislators){
    var repsObj = {};
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
    return repsObj;
}

function getLegislators(postcode, type, callback) {
    var openAusUrl = '';
    
    if (type === 'getRepresentatives' && postcode in cachedRepresentatives) {
        console.log('using cached Representative data...');
        callback(formatLegislators(cachedRepresentatives[postcode]));
        return;
    }

    if (type === 'getSenators' && postcode_to_state(postcode) in cachedSenators) {
        console.log('using cachedSenators data...');
        callback(formatLegislators(cachedSenators[postcode_to_state(postcode)]));
        return;
    }
    
    if (type === 'getRepresentatives') {
        openAusUrl = "http://www.openaustralia.org/api/getRepresentatives?key=" + openAusAPIKey + "&output=js&postcode=" + postcode;
    }

    if (type === 'getSenators') {
        openAusUrl = "http://www.openaustralia.org/api/getSenators?key=" + openAusAPIKey + "&output=js&state=" + postcode_to_state(postcode);
    }
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
        
        if (type === 'getSenators') {
        cachedSenators[postcode_to_state(postcode)] = legislators;
        }

        if (type === 'getRepresentatives') {
        cachedRepresentatives[postcode] = legislators;
        }
        
        callback(formatLegislators(legislators));
    });
}

module.exports = findLegislators;