var express = require('express');
var router = express.Router();
var passport = require('passport');
var Account = require('../models/account');


router.get('/', function(req, res) {
  res.render('register');
});

router.post('/', function(req, res) {
  var regInfo = {
    username: req.body.username,
    isAdmin: false,
    regDate: Date.now(),
    lastLogin: Date.now()
  }
  Account.register(new Account(regInfo), req.body.password, function (err, account) {
    if (err) {
      req.flash("info", "Sorry, this account already exists");  
      return res.render('register')
    }
    passport.authenticate('local')(req, res, function () {
      res.redirect('/');
    });
  });
});

module.exports = router;