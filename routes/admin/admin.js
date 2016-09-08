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
            // check if config file exists
            if (config.length > 0) {
                res.render('admin/admin', {user: req.user});
            } else {
                // ask user if they want to add config now
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

router.post('/', function (req, res) {
    if (req.user && req.user.isAdmin) {
        TabServerConfig.find({}).exec()
        .then(function (config) {
            if (config.length == 0) {
                console.log('tada!');
            } else {
                req.flash('info', 'Invalid request');
                res.redirect(302, '/admin');
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

module.exports = router;
