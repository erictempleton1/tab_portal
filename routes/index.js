var express = require('express');
var router = express.Router();
var passport = require('passport');
var Account = require('../models/account');


router.get('/', function(req, res) {
  res.render('index', {user: req.user});
});

router.get('/login', function(req, res) {
  res.render('login', {user: req.user});
});

// todo - handle invalid user/pw with message
router.post('/login', passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: "Invalid username or password"
      }),
      function(req, res) {
        req.flash("info", "Logged In!");
        res.redirect('/sites/' + req.user.username);
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

router.get('/ping', function(req, res) {
  res.status(200).send('pong!');
});

module.exports = router;
