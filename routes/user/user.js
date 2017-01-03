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
                        user: user,
                        moment: moment
                    }
                );
            }).catch(function(siteErr) {
                util.log(3, 'user page sites get request error: ' + siteErr);
                req.flash('info', 'Error loading sites');
                res.redirect('/user/' + req.params.username);
            });
        } else {
            req.flash('info', 'User not found');
            res.redirect('/');
        }
    }).catch(function(userErr) {
        util.log(3, 'user page get request error: ' + userErr);
        req.flash('info', 'Error finding user');
        res.redirect('/');
    });
});

router.get('/:username/settings', authReqs, function (req, res) {
    var redirectUrl = '/user/' + req.params.username + '/settings';
    Account.findOne({username: req.params.username})
    .exec()
    .then(function(user) {
        if (user) {
            res.render('user/user_settings', {user: user});
        } else {
            req.flash('info', 'User not found');
            res.redirect(redirectUrl);
        }
    }).catch(function(userErr) {
        util.log(3, 'user page settings get request error: ' + userErr);
        req.flash('info', 'Error finding user');
        res.redirect(redirectUrl);
    });
});

router.get('/:username/settings/password', authReqs, function(req, res) {
    Account.findOne({username: req.params.username})
    .exec()
    .then(function(user) {
        var redirectUrl = '/user/' + req.params.username + '/settings/password';
        if (user) {
            res.render('user/user_change_pw', {user: user});
        } else {
            req.flash('info', 'User not found');
            res.redirect(redirectUrl);
        }
    }).catch(function(userErr) {
        util.log(3, 'user page settings password get request error: ' + userErr);
        req.flash('info', 'Error getting user');
        res.redirect(redirectUrl);
    })
});

router.post('/:username/settings/password', [authReqs, valUser.validateUserPasswordPost], function(req, res) {
    Account.findOne({username: req.params.username})
    .exec()
    .then(function(userEdit) {
        var redirectUrl = '/user/' + req.params.username + '/settings';
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
    }).catch(function(err) {
        util.log(3, 'user page settings password post request error: ' + err);
        req.flash('info', 'An error occurred');
        res.redirect(redirectUrl);
    });
});

module.exports = router;