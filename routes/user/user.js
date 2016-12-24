var express = require('express'),
    router = express.Router(),
    moment = require('moment'),
    Account = require('../../models/account'),
    Sites = require('../../models/sites'),
    util = require('../../utility/utility');


// route only viewable by a logged in owner, and admin
var authReqs = [util.ensureUser, util.ensureUserAdmin];
router.get('/:username', authReqs, function (req, res) {
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
    }).catch(function (err) {
        req.flash('info', 'There was an error loading sites >> ' + err);
        res.redirect('/user/' + req.params.username);
    });
});

module.exports = router;