var express = require('express'),
    router = express.Router(),
    moment = require('moment'),
    Account = require('../../models/account'),
    Sites = require('../../models/sites'),
    util = require('../../utility/utility'),
    valAdmin = require('../../validators/admin');

router.get('/', util.ensureAdmin, function (req, res) {
    // page for listing all sites
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
        util.log(3, 'sites get request error: ' + err)
        req.flash('info', 'Error loading sites');
        res.redirect('/admin');
    });
});

router.get('/edit/:sitename', util.ensureAdmin, function (req, res) {
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
        util.log(3, 'site edit get request error: ' + err);
        req.flash('info', 'Error loading site');
        res.redirect('/admin/sites');
    });
});

router.post('/edit/:sitename', [util.ensureAdmin, valAdmin.validateSiteEditPost], function (req, res) {
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
        util.log(3, 'site edit post request error: ' + err);
        req.flash('info', 'Error updating site');
        res.redirect('/admin/sites');
    });
});

router.get('/remove/:sitename', util.ensureAdmin, function (req, res) {
    // page for confirming site deletion
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
        util.log(3, 'site remove get request error: ' + err);
        req.flash('info', 'Error removing site');
        res.redirect('/admin/sites');
    });
});

router.post('/remove/:sitename', [util.ensureAdmin, valAdmin.validateSiteRemovePost], function (req, res) {
    // post request to delete a site
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
        util.log(3, 'site remove post request error: ' + err);
        req.flash('info', 'Error removing site');
        res.redirect('/admin/sites');
    });
});

router.get('/new', util.ensureAdmin, function (req, res) {
    // form page for adding a new site
    // query all users to populate allowed users form
    Account.find({}).exec()
    .then(function (users) {
        res.render('admin/new_site', {users: users, user: req.user});
    }).catch(function (err) {
        util.log(3, 'add new site get request error: ' + err);
        req.flash('info', 'Error getting users');
        res.redirect('/admin/sites');
    });
});

router.post('/new', [util.ensureAdmin, valAdmin.validateNewSitePost], function (req, res) {
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
        util.log(3, 'add new site post request error: ' + err);
        req.flash('info', 'Error saving site');
        res.redirect('/admin/sites');
    });
});

module.exports = router;
