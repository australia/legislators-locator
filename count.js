var contactInfo = require('./lib/contactInfoByMemberId.json');

module.exports = function(req, res){
var email = 0;
var facebook = 0;
var twitter = 0;
var website = 0;

	for (member_id in contactInfo){
		if (contactInfo[member_id].email === 'null'){
			email ++;
		}
		if (contactInfo[member_id].facebook === 'null'){
			facebook ++;
		}
		if (contactInfo[member_id].twitter === 'null'){
			twitter ++;
		}
		if (contactInfo[member_id].website === 'null'){
			website ++;
		}
	}
res.send({email: email, facebook: facebook, twitter: twitter, website: website});
}