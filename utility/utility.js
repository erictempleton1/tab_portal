// helper functions


exports.cleanString = function(stringToClean) {
    // strip all whitespace and lowercase a string
    var cleanedString = stringToClean.replace(/ /g, '');
    return cleanedString.toLowerCase();
}
