var express = require('express'),
    router = express.Router(),
    Account = require('../../models/account'),
    Sites = require('../../models/sites');

// /user/eric  
router.get('/:username', function (req, res) {
    if (req.user) {
        if (req.user.isAdmin || req.user.username === req.params.username) {
            Sites.find({allowedUsers: req.params.username}).exec()
            .then(function (sites) {
                res.render('user/user_page', {sites: sites, username: req.params.username});
            }).catch(function (err) {
                req.flash('info', 'There was an error loading sites >> ' + err);
                res.redirect('/user/' + req.params.username);
            });
        } else {
            req.flash('info', 'Unauthorized');
            res.redirect('/');
        }
    } else {
        req.flash('info', 'Unauthorized');
        res.redirect('/');
    }
});

module.exports = router;