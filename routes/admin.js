var express = require('express');
var router = express.Router();
var passport = require('passport');
var Account = require('../models/account');
var request = require('request');
var config = require('../config');
var authUtil = require('../utility/tabServerAuth');
var ServerToken = require('../models/serverToken');


router.get('/', function(req, res) {
    // main admin page
    if (req.user && req.user.isAdmin) {
        // query all users and send to template
        Account.find({}, function(err, users) {
            if (err) {
                req.flash('info', 'There was an error loading users >> ' + err);
                res.render('admin');
            } else {
                // query the server token to show in the UI
                ServerToken.findOne({}, function(err, token) {
                    if (err) {
                        req.flash('info', 'There was an error querying the token');
                    } else {
                        res.render('admin', {
                            userAccts: users,
                            serverToken: token
                        });
                    }
                });
            }
        });
    } else {
        req.flash('info', 'Unauthorized');
        res.redirect(302, '/');
    }
});

router.get('/users', function(req, res) {
    if (req.user && req.user.isAdmin) {
        Account.find({}, function(err, users) {
            if (err) {
                req.flash('info', 'There was an error loading users >> ' + err);
                res.redirect('admin');
                // todo - finish else statement here
        res.send('Future users page! Todo - build ejs template and users query');
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
                res.render('user_edit', {user: user});
            }
        });
    } else {
        req.flash('info', 'Unauthorized');
        res.redirect(302, '/');
    }
});

router.post('/', function(req, res) {
    // request an access token from tab server
    if (req.user && req.user.isAdmin) {
        var parsedToken = authUtil.getTabServerToken(function(err, token) {
            if (err) {
                console.log(err);
            } else {
                // todo - save the new object
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
        res.redirect('admin');
    } else {
        req.flash('info', 'Unauthorized');
        res.redirect(302, '/');
    }
});

module.exports = router;