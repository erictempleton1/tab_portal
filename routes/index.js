var express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    Account = require('../models/account'),
    Promise = require('bluebird');


router.get('/', function (req, res) {
  res.render('index', {user: req.user});
});

router.get('/login', function (req, res) {
  if (!req.user) {
    res.render('login', {user: req.user});
  } else {
    req.flash('info', 'Already logged in');
    res.redirect(301, '/');
  }
});

// todo - add tab server trusted ticket request here?
router.post('/login', passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: "Invalid username or password"
  }),
  function (req, res) {
    // update the last login date
    var conditions = {'username': req.user.username},
        update = {'lastLogin': Date.now()},
        options = {'upsert': false};
    var updateAccount = Account.update(conditions, update, options).exec();
    updateAccount.then(function (user) {
      // send admin users to the admin site
      if (req.user.isAdmin) {
        res.redirect('/admin');
      } else {
        res.redirect('/sites/' + req.user.username);
      }
    }).catch(function (err) {
      req.flash('info', 'There was an error!');
      res.redirect('login');
    });
});

router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

router.get('/ping', function (req, res) {
  res.status(200).send('pong!');
});

module.exports = router;
