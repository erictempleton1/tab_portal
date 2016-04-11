var express = require('express');
var router = express.Router();
var passport = require('passport');
var Account = require('../models/account');

 
router.get('/', function(req, res) {
  res.render('index', {user: req.user});
});

router.get('/login', function(req, res) {
  if (!req.user) {
    res.render('login', {user: req.user});
  } else {
    req.flash('info', 'Already logged in');
    res.redirect(301, '/');
  }
});

router.post('/login', passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: "Invalid username or password"
      }),
      function(req, res) {
        // update the last login date
        var conditions = {'username': req.user.username};
        var update = {'lastLogin': Date.now()};
        var options = {'upsert': false};
        Account.update(conditions, update, options, function(err, doc) {
          if (err) {
            req.flash('info', 'There was an error!')
            res.redirect('login')
          } else {
            req.flash("info", "Logged In!");
            res.redirect('/sites/' + req.user.username);
          }
        });
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

router.get('/ping', function(req, res) {
  res.status(200).send('pong!');
});

module.exports = router;
