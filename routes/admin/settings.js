var express = require('express'),
    router = express.Router(),
    moment = require('moment'),
    TabServerConfig = require('../../models/tabServerConfig');


/**
 * Render settings page for admins to view config and other settings.
 * Only 1 config document is expected and accepted here.
 */
router.get('/', function (req, res) {
    if (req.user && req.user.isAdmin) {
        TabServerConfig.find({}).exec()
        .then(function(config) {
            if (config.length == 1) {
                res.render(
                    'admin/settings',
                    {
                        user: req.user,
                        config: config,
                        moment: moment
                    }
                );
            } else {
                req.flash(
                    'info',
                    'Error loading config. Found ' + config.length + ' records'
                );
                res.redirect('/admin');
            }
        }).catch(function (findErr) {
            req.flash('info', 'An error occurred: ' + findErr);
            res.redirect('/admin');
        });
    } else {
        req.flash('info', 'Unauthorized');
        res.redirect('/');
    }
});

/**
 * Render edit config settings page for admins.
 * Only 1 config document is expected and accepted here.
 */
router.get('/config/edit', function (req, res) {
    if (req.user && req.user.isAdmin) {
        TabServerConfig.find({}).exec()
        .then(function(config) {
            if (config.length == 1) {
                res.render(
                    'admin/edit_config',
                    {
                        user: req.user,
                        config: config,
                        moment: moment
                    }
                );
            } else {
                req.flash(
                    'info',
                    'Error loading config. Found ' + config.length + ' records'
                );
            }
        }).catch(function (findErr) {
            req.flash('info', 'An error occurred: ' + findErr);
            red.redirect('/admin');
        });
    } else {
        req.flash('info', 'Unauthorized');
        res.redirect('/');
    }
});

/**
 * Post request to update config values.
 * Only 1 config document is expected and accepted here.
 */
router.post('/config/edit', function (req, res) {
    if (req.user && req.user.isAdmin) {
        TabServerConfig.find({}).exec()
        .then(function(config){
            if (config.length == 1) {
                var serverObj = config[0];
                serverObj.tabServerUsername = req.body.tabServerUsername;
                serverObj.tabServerPassword = req.body.tabServerPassword;
                serverObj.tabServerUrl = req.body.tabServerUrl;
                serverObj.updatedDate = Date.now();
                serverObj.save(function(saveErr) {
                    if (!saveErr) {
                        req.flash('info', 'Config updated');
                        res.redirect('/admin/settings');
                    } else {
                        req.flash('info', 'Error updating config settings');
                        res.redirect('/admin/settings');
                    }
                })
            } else {
                req.flash('info', 'Expecting one config doc. Found ' + config.length);
                res.redirect('/admin/settings');
            }
        }).catch(function(err) {
            console.log(err);
            req.flash('info', 'Unable to save config settings due to internal error');
            res.redirect('/admin/settings');
        })
    }
});

module.exports = router;
