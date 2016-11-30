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
        res.redirect(403, '/');
    }
});

router.post('/', function (req, res) {
    if (req.user && req.user.isAdmin) {
        TabServerConfig.find({}).exec()
        .then(function (config) {
            if (config.length == 0) {
                console.log(req.body);
                if (Object.hasOwnProperty.call(req.body,'submit')) {
                    var submitVal = req.body.submit;
                    if (submitVal === 'Add Config') {
                        var configInfo = new TabServerConfig({
                            tabServerUsername: req.body.tabServerUsername,
                            tabServerPassword: req.body.tabServerPassword,
                            tabServerUrl: req.body.tabServerUrl,
                            addedDate: Date.now(),
                            updatedDate: Date.now()
                        });
                        configInfo.save(function (saveErr) {
                            if (saveErr) {
                                req.flash('info', 'Error on save: ' + saveErr);
                                res.redirect('/');
                            } else {
                                req.flash('info', 'Config settings added');
                                res.redirect('/admin');
                            }
                        });
                    } else if (submitVal === 'Skip For Now') {
                        // todo - save empty string fields here
                        var emptyConfigInfo = new TabServerConfig({
                            tabServerUsername: null,
                            tabServerPassword: null,
                            tabServerUrl: null,
                            addedDate: Date.now(),
                            updatedDate: Date.now()
                        });
                        emptyConfigInfo.save(function (emptySaveErr) {
                            if (emptySaveErr) {
                                req.flash('info', 'Error on save: ' + emptySaveErr);
                                res.redirect('/');
                            } else {
                                req.flash('info', 'Skipped setting config');
                                res.redirect('/admin');
                            }
                        });
                    } else {
                        req.flash('info', 'Unknown submit data');
                        res.redirect('/');
                    }
                } else {
                    req.flash('info', 'Missing submit data');
                    res.redirect('/');
                }
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
        res.redirect(403, '/');
    }
});

module.exports = router;
