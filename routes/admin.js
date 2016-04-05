var express = require('express');
var router = express.Router();
var passport = require('passport');
var Account = require('../models/account');
var request = require('request');
var config = require('../config');
var authUtil = require('../utility/auth');


router.get('/', function(req, res) {
    Account.find({}, function(err, users) {
        if (err) {
            req.flash("info", "There was an error >> " + err);
            res.render('admin');
        } else {
            res.render('admin', {userAccts: users});
        }
    });
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
    var testReq = new authUtil();
    console.log(testReq);
});

module.exports = router;