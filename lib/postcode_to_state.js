module.exports = function postcode_to_state(postcode) {
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