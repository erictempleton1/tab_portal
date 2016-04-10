var Account = require('../models/account');

exports.isAdmin = function(req) {
    console.log(req);
    Account.findOne({'username': req.user.username}, function(err, user) {
        if (err) {
            req.flash('info', 'Unable to find user >> ' + err);
            res.render('index');
            var userIsAdmin = false;
        } else if (user.isAdmin) {
            var userIsAdmin = true;
        } else {
            var userIsAdmin = false;
        }
        return userIsAdmin;
    });
};