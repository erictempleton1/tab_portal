var express = require('express'),
    router = express.Router(),
    moment = require('moment'),
    Account = require('../../models/account'),
    Sites = require('../../models/sites'),
    util = require('../../utility/utility');


// route only viewable by a logged in owner, and admin
var authReqs = [util.ensureUser, util.ensureUserAdmin];
router.get('/:username', authReqs, function (req, res) {
    Account.findOne({username: req.params.username}).exec()
    .then(function(user) {
        if (user) {
            Sites.find({allowedUsers: req.params.username}).exec()
            .then(function (sites) {
                res.render(
                    'user/user_page', 
                    {
                        sites: sites,
                        user: req.user,
                        moment: moment
                    }
                );
            }).catch(function (siteErr) {
                req.flash('info', 'There was an error loading sites >> ' + siteErr);
                res.redirect('/user/' + req.params.username);
            });
        } else {
            req.flash('info', 'User not found');
            res.redirect('/');
        }
    }).catch(function(userErr) {
        req.flash('info', 'Error finding user');
        res.redirect('/');
    });
});

module.exports = router;