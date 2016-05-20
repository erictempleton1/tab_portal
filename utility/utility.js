// helper functions


exports.cleanString = function(stringToClean) {
    // strip all whitespace from a string
    var cleanedString = stringToClean.replace(/ /g, '');
    return cleanedString.toLowerCase();
}
