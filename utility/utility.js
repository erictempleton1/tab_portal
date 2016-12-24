// helper functions

exports.cleanString = function(stringToClean) {
    var cleanedString = stringToClean.replace(/ /g, '');
    return cleanedString.toLowerCase();
};

exports.ensureAdmin = function(req, res, next) {
    if (req.user && req.user.isAdmin) {
        return next();
    }
    req.flash('info', 'Unauthorized');
    res.redirect(403, '/'); 
};

exports.ensureUserAdmin = function(req, res, next) {
    if (req.user.isAdmin || req.user.username === req.params.username) {
        return next();
    }
    req.flash('info', 'Unauthorized');
    res.redirect(403, '/');
};