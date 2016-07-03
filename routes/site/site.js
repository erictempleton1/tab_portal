var express = require('express'),
    router = express.Router(),
    util = require('../../utility/utility'),
    tabServerUtil = require('../../utility/tabServerAuth'),
    Account = require('../../models/account'),
    Sites = require('../../models/sites');
    
router.get('/:sitename', function (req, res) {
    // render the site page that displays the given workbook
    if (req.user) {
        Sites.findOne({siteName: req.params.sitename}).exec()
        .then(function (site) {
            if (site) {
                // make sure that the user is allowed to view the site or an admin
                if (site.allowedUsers.indexOf(req.user.username) >= 0 || req.user.isAdmin) {
                    res.render('site/site_page', {site: site, user: req.user});
                } else {
                    req.flash('info', 'User is not authorized to view this site');
                    res.redirect('/');
                }
            } else {
                req.flash('info', 'Site not found');
                res.redirect('/');
            }
        }).catch(function (err) {
            req.flash('info', 'There was an error loading site >> ' + err);
            res.redirect('/');
        });
    } else {
        req.flash('info', 'Unauthorized');
        res.redirect('/');
    }
});

// todo - finish post request here, add forms to ejs, and write utility function 
// for trusted ticket!
router.post('/:sitename', function(req, res) {
    if (req.user) {
        Sites.findOne({siteName: req.params.sitename}).exec()
        .then(function (site) {
            if (site) {
                if (site.allowedUsers.indexOf(req.user.username) >= 0 || req.user.isAdmin) {
                    tabServerUtil.getTrustedTicket(req.user.username, req.params.sitename)
                    .then(function (ticket) {
                        console.log(ticket);
                    });
                    res.render('site/site_page', {site: site, user: req.user});
                } else {
                    req.flash('info', 'User is not authorized to view this site');
                    res.redirect('/');
                }
            } else {
                req.flash('info', 'Site not found');
                res.redirect('/');
            }
        }).catch(function (err) {
            req.flash('info', 'There was an error loading site >> ' + err);
            res.redirect('/');
        });
    } else {
        req.flash('info', 'Unauthorized');
        res.redirect('/');
    }
});

module.exports = router;