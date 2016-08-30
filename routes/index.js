var express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    Account = require('../models/account'),
    util = require('../utility/utility'),
    Promise = require('bluebird');


router.get('/', function (req, res) {
  Account.find({}).exec()
  .then(function (users) {
    if (users.length > 0) {
      res.render('index', {user: req.user});
    } else {
      // no users have been found so prompt user to create an admin
      res.render('create_admin', {user: req.user});
    }
  }).catch(function (findOneErr) {
      console.log(findOneErr);
  });
});

router.post('/', function (req, res) {
  // post request for first startup when there is no admin user
  Account.find({}).exec()
  .then(function (users) {
    // only allow this method when there are no other users
    if (users.length > 0) {
      req.flash('info', 'Invalid request');
      res.redirect(301, '/');
    } else {
      var regInfo = {
        username: util.cleanString(req.body.username),
        isAdmin: true,
        regDate: Date.now(),
        lastLogin: Date.now()
      };
      Account.register(new Account(regInfo), req.body.password, function (regErr, account) {
        if (regErr) {
          req.flash('info', 'Error creating account: ' + regErr);
          res.redirect('/');
        } else {
          req.flash('info', 'Admin user created');
          res.redirect('/');
        }
      });
    }
  });
});

router.get('/login', function (req, res) {
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
