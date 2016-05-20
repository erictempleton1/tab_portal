var express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    Account = require('../../models/account'),
    Sites = require('../../models/sites'),
    request = require('request'),
    config = require('../../config'),
    authUtil = require('../../utility/tabServerAuth'),
    util = require('../../utility/utility'),
    ServerToken = require('../../models/serverToken'),
    Sites = require('../../models/sites');


router.get('/', function (req, res) {
    // main admin page
    if (req.user && req.user.isAdmin) {
        // query the server token to show in the UI
        ServerToken.findOne({}, function (err, token) {
            if (err) {
                req.flash('info', 'There was an error querying the token');
            } else {
                res.render('admin/admin', {
                    serverToken: token
                });
            }
        });
    } else {
        req.flash('info', 'Unauthorized');
        res.redirect(302, '/');
    }
});

router.post('/', function (req, res) {
    // request an access token from tab server and save
    if (req.user && req.user.isAdmin) {
        var parsedToken = authUtil.getTabServerToken(function (err, token) {
            if (err) {
                console.log(err);
            } else {
                var tokenInfo = new ServerToken({
                    refreshDate: Date.now(),
                    tabServerToken: token
                });
                tokenInfo.save(function (err) {
                    if (err) {
                        req.flash('info', 'An error occurred');
                    } else {
                        req.flash('info', 'Server token refreshed!');
                        console.log(token);
                    }
                });
            }
        });
        res.redirect('/admin');
    } else {
        req.flash('info', 'Unauthorized');
        res.redirect(302, '/');
    }
});

module.exports = router;