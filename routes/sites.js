var express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    Account = require('../models/account');

// todos -

// keep the findone query, but search for the site name instead, then check if the site is private,
// and if so, can the given user access it. redirect to homepage otherwise.


router.get('/:username', function (req, res) {
  Account.findOne({'username': req.params.username}, function (err, user) {
    if (!err) {
      if (req.user) {
        // admins and site owner can access the site
        if (req.params.username === req.user.username || req.user.isAdmin) {
          res.render('admin/user_page', {user: user});
        } else {
          req.flash("info", "Unauthorized");
          res.redirect('/');
        }
      } else {
        req.flash('info', 'Unauthorized');
      }
    } else {
      req.flash('info', 'Error');
      res.redirect('/');
    }
  });
});

module.exports = router;