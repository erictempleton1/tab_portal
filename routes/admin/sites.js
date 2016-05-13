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
    // page for listing all sites
    if (req.user && req.user.isAdmin) {
        Sites.find({}, function (err, sites) {
            if (err) {
                req.flash('info', 'There was an error loading sites >> ' + err);
                res.redirect('admin');
            } else {
                res.render('admin/sites_list', {sites: sites});
            }
        });
    } else {
        req.flash('info', 'Unauthorized');
        res.redirect('/');
    }
});

router.get('/edit/:id', function (req, res) {
    // get a single site
    if (req.user && req.user.isAdmin) {
        Sites.findOne({'_id': req.params.id}, function (err, site) {
            if (err) {
                req.flash('info', 'There was an error');
                res.redirect('/admin');
            } else {
                res.render('admin/site_edit', {site: site});
            }
        });
    } else {
        req.flash('info', 'Unauthorized');
        res.redirect(302, '/');
    }
});

router.get('/new', function (req, res) {
    // form page for adding a new site
    if (req.user && req.user.isAdmin) {
        // query all users to populate allowed users form
        Account.find({}, function (err, users) {
            if (err) {
                req.flash('info', 'Error getting users');
                res.redirect(301, '/admin');
            } else {
                res.render('admin/new_site', {users: users});
            }
        });
    } else {
        req.flash('info', 'Unauthorized');
        res.redirect('/');
    }
});

router.post('/new', function (req, res) {
    // add a new site
    if (req.user && req.user.isAdmin) {
        var newSite =  new Sites({
            createdDate: Date.now(),
            editedDate: Date.now(),
            allowedUsers: req.body.allowedUsers,
            siteUrl: req.body.siteUrl,
            siteName: util.cleanSiteName(req.body.siteName),
            isPrivate: req.body.isPrivate
        });
        // todo - add more form validation
        if (req.body.allowedUsers === undefined) {
            req.flash('info', 'Please select users');
            res.redirect('/admin/sites/new');
        } else {
            // check to see if the site name is in use already before saving
            Sites.findOne({'siteName': util.cleanSiteName(req.body.siteName)}, function (err, site) {
                if (err) {
                    req.flash('info', 'Error checking site');
                    res.redirect('/admin/sites/new');
                } else if (!site) {
                    newSite.save(function (err) {
                        if (err) {
                            req.flash('info', 'Error saving site');
                            res.redirect('/admin/sites/new');
                        } else {
                            req.flash('info', 'New site created!');
                            res.redirect('/admin/sites');
                        }
                    });
                } else {
                    req.flash('info', 'Site name already in use');
                    res.redirect('/admin/sites/new');
                }
            });
        }
    } else {
        req.flash('info', 'Unauthorized');
        res.redirect('/');
    }
});

module.exports = router;
