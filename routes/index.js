var express = require('express');
var router = express.Router();
var passport = require('passport');
var Account = require('../models/account');


router.get('/', function(req, res) {
  res.render('index', {user: req.user});
});

// todo - only auth'd users matching username should be able to access here
router.get('/sites/:username', function(req, res) {
  Account.findOne({'username': req.params.username}, function(error, user) {
    if (!error) {
      if (user && req.user) {
        res.render('user_page', {user: user.username});
      } else {
        // todo - better error msg needed here
        res.render('user_page', {user: 'user not found'});
      }
    } else {
      res.render('user_page', {user: 'error'});
    }
  });
});

router.get('/register', function(req, res) {
  res.render('register', {title: 'Register'});
});

router.post('/register', function(req, res) {
  Account.register(new Account({username: req.body.username}), req.body.password, function (err, account) {
    if (err) {
      return res.render('register', {account: account});
    }
    passport.authenticate('local')(req, res, function () {
      res.redirect('/');
    });
  });
});

router.get('/login', function(req, res) {
  res.render('login', {user: req.user});
});

router.post('/login', passport.authenticate('local'), function(req, res) {
  res.redirect('/');
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

router.get('/ping', function(req, res) {
  res.status(200).send('pong!');
});

module.exports = router;
