var express = require('express'),
    router = express.Router(),
    moment = require('moment'),
    Account = require('../../models/account'),
    Sites = require('../../models/sites'),
    util = require('../../utility/utility');

router.get('/', function (req, res) {
    // page for listing all sites
    if (req.user && req.user.isAdmin) {
        Sites.find({}).exec()
        .then(function (sites) {
            res.render(
                'admin/sites_list',
                {
                    user: req.user,
                    sites: sites,
                    moment: moment
                }
            );
        }).catch(function (err) {
            req.flash('info', 'There was an error loading sites >> ' + err);
        });
    } else {
        req.flash('info', 'Unauthorized');
        res.redirect(403, '/');
    }
});

router.get('/edit/:sitename', function (req, res) {
    // get a single site
    if (req.user && req.user.isAdmin) {
        // execute the queries in paralell since they don't depend on each other.
        var findSitesAccounts = [
            Sites.findOne({siteName: req.params.sitename}).exec(),
            Account.find({}).exec()
        ];
        Promise.all(findSitesAccounts)
        .then(function (result) {
            // access the result of the execs, and send to template
            var site = result[0],
                users = result[1];
            if (site) {
                res.render(
                    'admin/site_edit',
                    {
                        site: site,
                        users: users,
                        user: req.user
                    }
                );
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
        res.redirect(403, '/');
    }
});

router.post('/edit/:sitename', function (req, res) {
    if (req.user && req.user.isAdmin) {
        req.checkBody('siteName', 'Invalid site name').notEmpty();
        req.checkBody('vizUrl', 'Invalid site url').notEmpty();
        req.checkBody('allowedUsers', 'Invalid allowed users list').notEmpty();
        req.checkBody('isTabServerViz', 'Invalid tab server viz setting').notEmpty().isBoolean();
        req.checkBody('trustedLogin', 'Invalid trusted viz setting').notEmpty().isBoolean();
        req.checkParams('sitename', 'Invalid sitename parameter').notEmpty();
        req.getValidationResult()
        .then(function(valResult) {
            if (valResult.isEmpty()) {
                var checkSitesQueries = [
                    Sites.findOne({siteName: req.params.sitename}).exec(),
                    Sites.findOne({siteName: req.body.siteName}).exec()
                ];
                // run the two queries in parallel
                Promise.all(checkSitesQueries)
                .then(function (siteResults) {
                    var site = siteResults[0],
                        existingSite = siteResults[1];
                    if (!site) {
                        req.flash('info', 'Site not found');
                        res.redirect('/admin/sites');
                    // save if the site name is unchanged, or isn't already in use
                    } else if (!existingSite || existingSite.siteName === site.siteName) {
                        site.siteName = util.cleanString(req.body.siteName);
                        site.vizUrl = req.body.vizUrl;
                        site.allowedUsers = req.body.allowedUsers;
                        site.isTabServerViz = req.body.isTabServerViz;
                        site.trustedLogin = req.body.trustedLogin;
                        site.save();
                        req.flash('info', 'Site updated!');
                        res.redirect('/admin/sites');
                    } else {
                        req.flash('info', 'Site name already in use');
                        res.redirect('/admin/sites');
                    }
                })
                .catch(function (err) {
                    req.flash('info', 'There was an error loading the site >> ' + err);
                    res.redirect('/admin/sites');
                });
            } else {
                res.send('Validation error');
            }
        });
    } else {
        req.flash('info', 'Unauthorized');
        res.redirect(403, '/');
    }
});

router.get('/remove/:sitename', function (req, res) {
    // page for confirming site deletion
    if (req.user && req.user.isAdmin) {
        Sites.findOne({siteName: req.params.sitename}).exec()
        .then(function (site) {
            if (site) {
                res.render(
                    'admin/remove_site',
                    {user: req.user, site: site, moment: moment}
                );
            } else {
                req.flash('info', 'Site not found');
                res.redirect('/admin/sites');
            }
        }).catch(function (err) {
            req.flash('info', 'There was an error loading site >> ' + err);
            res.redirect('/admin/sites');
        });
    } else {
        req.flash('info', 'Unauthorized');
        res.redirect(403, '/');
    }
});

router.post('/remove/:sitename', function (req, res) {
    // post request to delete a site
    if (req.user && req.user.isAdmin) {
        req.checkParams('sitename', 'Missing parameter').notEmpty();
        req.getValidationResult()
        .then(function(valResult) {
            if (valResult.isEmpty()) {
                Sites.remove({siteName: req.params.sitename}).exec()
                .then(function (site) {
                    if (site) {
                        req.flash('info', 'Site removed!');
                        res.redirect('/admin/sites');
                    } else {
                        req.flash('info', 'Site not found');
                        res.redirect('/admin/sites');
                    }
                }).catch(function (err) {
                    req.flash('info', 'An error occurred while deleting site');
                    res.redirect('/admin/sites');
                });
            } else {
                res.send('Validation error');
            }
        });
    } else {
        req.flash('info', 'Unauthorized');
        res.redirect(403, '/');
    }
});

router.get('/new', function (req, res) {
    // form page for adding a new site
    if (req.user && req.user.isAdmin) {
        // query all users to populate allowed users form
        Account.find({}).exec()
        .then(function (users) {
            res.render('admin/new_site', {users: users, user: req.user});
        }).catch(function (err) {
            req.flash('info', 'Error getting users');
            res.redirect('/admin/sites');
        });
    } else {
        req.flash('info', 'Unauthorized');
        res.redirect(403, '/');
    }
});

router.post('/new', function (req, res) {
    // add a new site
    if (req.user && req.user.isAdmin) {
        req.checkBody('siteName', 'Invalid site name').notEmpty();
        req.checkBody('vizUrl', 'Invalid site url').notEmpty();
        req.checkBody('allowedUsers', 'Invalid allowed users list').notEmpty();
        req.checkBody('isTabServerViz', 'Invalid tab server viz setting').notEmpty().isBoolean();
        req.checkBody('trustedLogin', 'Invalid trusted login setting').notEmpty().isBoolean();
        req.getValidationResult()
        .then(function(valResult) {
        // todo - add more form validation
            if (valResult.isEmpty()) {
                // check to see if the site name is in use already before saving
                Sites.findOne({siteName: util.cleanString(req.body.siteName)}).exec()
                .then(function (siteFind) {
                    if (!siteFind) {
                        // crete the new site if the name isn't in use
                        var newSite = new Sites({
                            createdDate: Date.now(),
                            editedDate: Date.now(),
                            allowedUsers: req.body.allowedUsers,
                            vizUrl: req.body.vizUrl,
                            trustedLogin: req.body.trustedLogin,
                            siteName: util.cleanString(req.body.siteName),
                            isTabServerViz: req.body.isTabServerViz
                        });
                        newSite.save();
                        req.flash('info', 'New site created');
                        res.redirect('/admin/sites');
                    } else {
                        req.flash('info', 'Site name already in use');
                        res.redirect('/admin/sites/new');
                    }
                }).catch(function (err) {
                    req.flash('info', 'An error occurred while saving site >> ' + err);
                    res.redirect('/admin/sites');
                });
            } else {
                res.send('Validation error');
            }
        });
    } else {
        req.flash('info', 'Unauthorized');
        res.redirect(403, '/');
    }
});

module.exports = router;
