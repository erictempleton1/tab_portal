var express = require('express');
var router = express.Router();
var passport = require('passport');
var Account = require('../models/account');


router.get('/', function(req, res) {
  res.render('register');
});

// todo - need to fix error message and handling here
// username already in use ect...
router.post('/', function(req, res) {
  Account.register(new Account({username: req.body.username}), req.body.password, function (err, account) {
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