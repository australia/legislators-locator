var fs = require('fs');
var getRepresentatives = require('./getRepresentatives');

var newAusMpContacts = '';

fs.readFile('./aus_mp_contact_details.csv', function(err, data) {

    getRepresentatives.forEach(function(rep) {
        member_id = rep.member_id,
        first_name = rep.first_name,
        last_name = rep.last_name
        // console.log(first_name, last_name, member_id);
        if (err) throw err;

        var rows = data.toString().split("\n");
        for (i in rows) {

            var cells = rows[i].split(",");

            var cell = cells[2];

            // console.log(cell);
            if (typeof cell !== 'undefined' && (cell.indexOf(first_name) !== -1) && (cell.indexOf(last_name) !== -1)) {

                console.log(member_id, first_name, last_name);
                console.log(cells[1], cells[2]);
                console.log('*********************************************');
                newAusMpContacts += rows[i] + ',' + member_id + '\n';

            } else {
                // newAusMpContacts += rows[i] + ',' + null + '\n';
            }
        }
    });
    fs.writeFileSync('./newAusMpContacts.csv', newAusMpContacts);
});