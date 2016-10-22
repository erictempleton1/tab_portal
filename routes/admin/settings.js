var express = require('express'),
    router = express.Router(),
    TabServerConfig = require('../../models/tabServerConfig');


/**
 * Render settings page for admins to edit config settings
 * for tableau server instances and other info.
 */
router.get('/', function (req, res) {
    if (req.user && req.user.isAdmin) {
        TabServerConfig.find({}).exec()
        .then(function(config) {
            if (config.length == 1) {
                res.render('admin/settings', {user: req.user, config: config});
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

module.exports = router;
