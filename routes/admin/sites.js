var express = require('express'),
    router = express.Router(),
    Account = require('../../models/account'),
    Sites = require('../../models/sites'),
    util = require('../../utility/utility');

router.get('/', function (req, res) {
    // page for listing all sites
    if (req.user && req.user.isAdmin) {
        var findSites = Sites.find({}).exec();
        findSites.then(function (sites) {
            res.render('admin/sites_list', {sites: sites});
        }).catch(function (err) {
            req.flash('info', 'There was an error loading sites >> ' + err);
        });
    } else {
        req.flash('info', 'Unauthorized');
        res.redirect('/');
    }
});

// todo - work on this route!
router.get('/edit/:sitename', function (req, res) {
    // get a single site
    if (req.user && req.user.isAdmin) {
        // execute the queries in paralell since they don't depend on each other.
        var findSitesAccounts = [
            Sites.findOne({siteName: req.params.sitename}).exec(),
            Account.find({}).exec()
        ]
        Promise.all(findSitesAccounts).then(function (result) {
            // access the result of the execs, and send to template
            var site = result[0],
                users = result[1];
            if (site) {
                res.render('admin/site_edit', {site: site, users: users});
            } else {
                req.flash('info', 'Site not found');
                res.redirect('/admin/sites');
            }
        }).catch(function (err) {
            req.flash('info', 'There was an error loading site');
            res.redirect('/admin/sites');
        });
    } else {
        req.flash('info', 'Unauthorized');
        res.redirect(302, '/');
    }
});

router.post('/edit/:sitename', function (req, res) {
    if (req.user && req.user.isAdmin) {
        Sites.findOne({sitename: req.params.sitename}).exec()
        .then(function (site) {
            if (!site || existing.siteName === site.siteName) {
                    site.siteName = req.body.siteName;
                        site.siteUrl = req.body.siteUrl;
                        site.isPrivate = req.body.isPrivate;
                        site.allowedUsers = req.body.allowedUsers;
                        site.save();
                        req.flash('info', 'Site updated!');
                        res.redirect('/admin/sites');
            } else {
                req.flash('info', 'Site name already in use');
                res.redirect('/admin/sites');
            }
        });
    } else {
        req.flash('info', 'Unauthorized');
        res.redirect('/');
    }
});

router.get('/remove/:id', function (req, res) {
    // page for confirming site deletion
    if (req.user && req.user.isAdmin) {
        Sites.findOne({_id: req.params.id}, function (err, site) {
            if (err) {
                req.flash('info', 'An error occurred finding site');
                res.redirect('/admin/sites');
            } else {
                res.render('admin/remove_site', {site: site});
            }
        });
    } else {
        req.flash('info', 'Unauthorized');
        res.redirect('/');
    }
});

router.post('/remove/:id', function (req, res) {
    // post request to delete a site
    if (req.user && req.user.isAdmin) {
        Sites.remove({_id: req.params.id}, function (err, site) {
            if (err) {
                req.flash('info', 'An error occurred deleting site');
                res.redirect('/sites');
            } else {
                req.flash('info', 'Site removed!');
                res.redirect('/admin/sites');
            }
        });
    } else {
        req.flash('info', 'Unauthorized');
        res.redirect('/');
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
        var newSite = new Sites({
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
            Sites.findOne({siteName: util.cleanSiteName(req.body.siteName)}, function (err, site) {
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
