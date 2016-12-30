var express = require('express'),
    router = express.Router(),
    moment = require('moment'),
    Account = require('../../models/account'),
    Sites = require('../../models/sites'),
    util = require('../../utility/utility'),
    valUser = require('../../validators/user'),
    authReqs = [util.ensureUser, util.ensureUserAdmin];


router.get('/:username', authReqs, function(req, res) {
    Account.findOne({username: req.params.username})
    .exec()
    .then(function(user) {
        if (user) {
            Sites.find({allowedUsers: req.params.username})
            .exec()
            .then(function (sites) {
                res.render(
                    'user/user_page', 
                    {
                        sites: sites,
                        user: req.user,
                        moment: moment
                    }
                );
            }).catch(function(siteErr) {
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

router.get('/:username/settings', authReqs, function (req, res) {
    Account.findOne({username: req.params.username})
    .exec()
    .then(function(user) {
        if (user) {
            res.render('user/user_settings', {user: req.user});
        } else {
            req.flash('info', 'User not found');
            res.redirect('/');
        }
    }).catch(function(userErr) {
        req.flash('info', 'Error finding user');
        res.redirect('/');
    });
});

router.post('/:username/settings/password', [authReqs,valUser.validateUserPasswordPost], function(req, res) {
    Account.findOne({username: req.params.username})
    .exec()
    .then(function(userEdit) {
        var redirectUrl = '/' + req.params.username + '/settings';
        if (userEdit) {
            userEdit.setPassword(req.body.password, function() {
                userEdit.save();
                req.flash('info', 'Password updated');
                res.redirect(redirectUrl);
            });
        } else {
            req.flash('info', 'Unable to find user');
            res.redirect(redirectUrl);
        }
    })
    .catch(function(err) {
        req.flash('info', 'An error occurred');
        res.redirect(redirectUrl);
    });
});

module.exports = router;