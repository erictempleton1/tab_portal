var express = require('express');
var router = express.Router();
var passport = require('passport');
var Account = require('../models/account');
var request = require('request');
var config = require('../config');
var authUtil = require('../utility/tabServerAuth');


router.get('/', function(req, res) {
    // only logged in users can attempt admin access
    if (req.user) {
        // check to see if the user is an admin
        Account.findOne({'username': req.user.username}, function(err, user) {
            if (err) {
                req.flash('info', 'Unable to find user >> ' + err);
                res.render('index');
            } else if (user.isAdmin) {
                // query all users for admin page
                Account.find({}, function(err, users) {
                    if (err) {
                        req.flash('info', 'There was an error loading users >> ' + err);
                        res.render('admin');
                    } else {
                        res.render('admin', {userAccts: users});
                    }
                });
            } else {
                req.flash('info', 'Unauthorized');
                res.render('index', {user: user});
            }
        });
    } else {
        res.redirect('login');
    }
});

router.get('/user/:id', function(req, res) {
    Account.findOne({'_id': req.params.id}, function(err, user) {
        if (err) {
            req.flash("info", "User not found");
        } else {
            res.render('user_edit', {user: user});
        }
    });
});

router.post('/', function(req, res) {
    // todo - add more code here. render or send ect...
    authUtil.getTabServerToken();
});

module.exports = router;