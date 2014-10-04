var fs = require('fs');
var getSenators = require('./getSenators');
var getRepresentatives = require('./getRepresentatives');

var newAusMpContacts = {};

fs.readFile('./legislator_contacts_with_member_id.csv', function(err, data) {

    // console.log(first_name, last_name, member_id);
    if (err) throw err;
    var rows = data.toString().split("\n");
    for (i in rows) {

        var cells = rows[i].split(",");

        var cell = cells[2];
        var foundMatch = false;
        getSenators.forEach(function(rep) {
            member_id = rep.member_id,
            first_name = rep.first_name,
            last_name = rep.last_name

            // console.log(cell);
            if (typeof cell !== 'undefined' && (cell.indexOf(first_name) !== -1) && (cell.indexOf(last_name) !== -1)) {

                //console.log(member_id);
                /*
                console.log({
                    full_name: cells[2],
                    contact_page: cells[5],
                    email: cells[7],
                    photo_url: cells[6],
                    facebook: cells[8],
                    twitter: cells[9],
                    website: cells[10]
                });
                console.log('*********************************************', cells.length);*/
                newAusMpContacts[member_id] = {
                    full_name: cells[2],
                    contact_page: cells[5],
                    email: cells[7],
                    photo_url: cells[6],
                    facebook: cells[8],
                    twitter: cells[9],
                    website: cells[10]
                };
                foundMatch = true;

            } else {
            }
        });
        if (!foundMatch && cells[0] !== 'representatives') {
            // newAusMpContacts += rows[i] + ',' + null + '\n';
        }
        getRepresentatives.forEach(function(rep) {
            member_id = rep.member_id,
            first_name = rep.first_name,
            last_name = rep.last_name

            // console.log(cell);
            if (typeof cell !== 'undefined' && (cell.indexOf(first_name) !== -1) && (cell.indexOf(last_name) !== -1)) {

                //console.log(member_id);
                /*
                console.log({
                    full_name: cells[2],
                    contact_page: cells[5],
                    email: cells[7],
                    photo_url: cells[6],
                    facebook: cells[8],
                    twitter: cells[9],
                    website: cells[10]
                });
                console.log('*********************************************', cells.length);*/
                newAusMpContacts[member_id] = {
                    full_name: cells[2],
                    contact_page: cells[5],
                    photo_url: cells[6],
                    email: cells[7],
                    facebook: cells[8],
                    twitter: cells[9],
                    website: cells[10]
                };
                foundMatch = true;

            }
        });
        if (!foundMatch && cells[0] !== 'senate') {
            // newAusMpContacts += rows[i] + ',' + null + '\n';
        }

        if (!foundMatch) {
            console.log('who', rows[i]);
            // newAusMpContacts += rows[i] + ',' + null + '\n';
        }
    }
    fs.writeFileSync('./test.json', JSON.stringify(newAusMpContacts));
});