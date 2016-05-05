var express = require('express');
var router = express.Router();
var passport = require('passport');
var Account = require('../models/account');
var Sites = require('../models/sites');
var request = require('request');
var config = require('../config');
var authUtil = require('../utility/tabServerAuth');
var util = require('../utility/utility');
var ServerToken = require('../models/serverToken');
var Sites = require('../models/sites');


router.get('/', function(req, res) {
    // main admin page
    if (req.user && req.user.isAdmin) {
        // query the server token to show in the UI
        ServerToken.findOne({}, function(err, token) {
            if (err) {
                req.flash('info', 'There was an error querying the token');
            } else {
                res.render('admin/admin', {
                    serverToken: token
                });
            }
        });
    } else {
        req.flash('info', 'Unauthorized');
        res.redirect(302, '/');
    }
});

router.get('/users', function(req, res) {
    // page for listing all users
    if (req.user && req.user.isAdmin) {
        Account.find({}, function(err, users) {
            if (err) {
                req.flash('info', 'There was an error loading users >> ' + err);
                res.redirect('admin');
            } else {
                res.render('admin/users_list', {users: users});
            }
        });
    } else {
        req.flash('info', 'Unauthorized');
        res.redirect('/');
    }
});

router.get('/user/:id', function(req, res) {
    // admin can view/edit a single user
    if (req.user && req.user.isAdmin) {
        // query the single user using the _id param
        Account.findOne({'_id': req.params.id}, function(err, user) {
            if (err) {
                req.flash("info", "User not found");
                res.redirect(301, '/admin');
            } else {
                res.render('admin/user_edit', {user: user});
            }
        });
    } else {
        req.flash('info', 'Unauthorized');
        res.redirect(302, '/');
    }
});

router.get('/users/new', function(req, res) {
    // form for adding a new user
    if (req.user && req.user.isAdmin) {
        res.render('add_users');
    } else {
        req.flash('info', 'Unauthorized');
        res.redirect(302, '/');
    }
});

router.post('/users/new', function(req, res) {
    // post request for adding a new user
    var regInfo = {
        username: req.body.username,
        isAdmin: false,
        regDate: Date.now(),
        lastLogin: Date.now(),
    };
    Account.register(new Account(regInfo), req.body.password, function (err, account) {
    if (err) {
      req.flash("info", "Sorry, this account already exists");  
      return res.render('add_users')
    }
    passport.authenticate('local')(req, res, function() {
      res.redirect('/admin/users');
    });
  });
});

router.get('/site/:id', function(req, res) {
    // get a single site
    if (req.user && req.user.isAdmin) {
        Sites.findOne({'_id': req.params.id}, function(err, site) {
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

router.get('/sites', function(req, res) {
    // page for listing all sites
    if (req.user && req.user.isAdmin) {
        Sites.find({}, function(err, sites) {
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

router.get('/sites/new', function(req, res) {
    // form page for adding a new site
    if (req.user && req.user.isAdmin) {
        // query all users to populate allowed users form
        Account.find({}, function(err, users) {
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

router.post('/sites/new', function(req, res) {
    // add a new site
    if (req.user && req.user.isAdmin) {
        var newSite = new Sites({
            createdDate: Date.now(),
            editedDate: Date.now(),
            allowedUsers: req.body.allowedUsers,
            siteUrl: req.body.siteUrl,
            siteName: util.removeWhitespace(req.body.siteName),
            isPrivate: req.body.isPrivate
        });
        // todo - add more form validation
        if (req.body.allowedUsers === undefined) {
            req.flash('info', 'Please select users');
            res.redirect('/admin/sites/new');
        } else {
            newSite.save(function(err) {
                if (err) {
                    req.flash('info', 'An error occurred');
                    res.redirect('/admin');
                } else {
                    req.flash('info', 'New site added');
                    res.redirect('/admin/sites');
                }
            });
        }
    } else {
        req.flash('info', 'Unauthorized');
        res.redirect('/');
    }
});

router.post('/', function(req, res) {
    // request an access token from tab server and save
    if (req.user && req.user.isAdmin) {
        var parsedToken = authUtil.getTabServerToken(function(err, token) {
            if (err) {
                console.log(err);
            } else {
                var tokenInfo = new ServerToken({
                    refreshDate: Date.now(),
                    tabServerToken: token
                });
                tokenInfo.save(function(err) {
                    if (err) {
                        req.flash('info', 'An error occurred');
                    } else {
                        req.flash('info', 'Server token refreshed!');
                        console.log(token);
                    }
                });
            }
        });
        res.redirect('/admin');
    } else {
        req.flash('info', 'Unauthorized');
        res.redirect(302, '/');
    }
});

module.exports = router;