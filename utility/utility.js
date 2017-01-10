var winston = require('winston');


// logging configuration

winston.level = 'debug';
logFilename = 'tab_portal.log';
winston.configure({
    transports: [
        new (winston.transports.File)({filename: logFilename})
    ]
});
logLevelMapping = {
    0: 'debug',
    1: 'info',
    2:  'warn',
    3: 'error'
};


// helper functions

exports.cleanString = function(stringToClean) {
    var cleanedString = stringToClean.replace(/ /g, '');
    return cleanedString.toLowerCase();
};

exports.slugify = function(rawString) {
    return rawString.toString().toLowerCase()
        .replace(/\s+/g, '-')  // replace spaces with -
        .replace(/[^\w\-]+/g, '')  // replace non-alpha chars leaving -
        .replace(/^-+/, '')  // replace - from start of str
        .replace(/-+$/, '');  // replace - from end of str
};

exports.ensureAdmin = function(req, res, next) {
    if (req.user && req.user.isAdmin) {
        return next();
    }
    req.flash('info', 'Unauthorized');
    res.redirect(303, '/'); 
};

exports.ensureUser = function(req, res, next) {
    if (req.user) {
        return next();
    }
    req.flash('info', 'Login required');
    res.redirect(303, '/');
};

exports.ensureUserAdmin = function(req, res, next) {
    if (req.user.isAdmin || req.user.username === req.params.username) {
        return next();
    }
    req.flash('info', 'Unauthorized');
    res.redirect(303, '/');
};

exports.log = function(level, message) {
    winston.log(logLevelMapping[level], message);
};

exports.failureMessages = {
      failureRedirect: "/login",
      failureFlash: "Invalid username or password"
    };
