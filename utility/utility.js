// helper functions


exports.cleanSiteName = function(siteName) {
    // strip all whitespace from a string
    var cleanedSiteName = siteName.replace(/ /g, '');
    return cleanedSiteName.toLowerCase();
}
