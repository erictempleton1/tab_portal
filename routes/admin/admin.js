var express = require('express'),
    router = express.Router(),
    authUtil = require('../../utility/tabServerAuth'),
    ServerToken = require('../../models/serverToken'),
    TabServerConfig = require('../../models/tabServerConfig');


router.get('/', function (req, res) {
    // main admin page
    if (req.user && req.user.isAdmin) {
        TabServerConfig.find({}).exec()
        .then(function (config) {
            if (config.length > 0) {
                res.render('admin/admin', {user: req.user});
            } else {
                res.render('admin/create_config', {user: req.user});
            }
        }).catch(function (err) {
            req.flash('info', 'An error occurred: ' + err);
            res.redirect('/admin');
        });
    } else {
        req.flash('info', 'Unauthorized');
        res.redirect(302, '/');
    }
});

// todo - convert this over to promises or just remove it all together for now
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
