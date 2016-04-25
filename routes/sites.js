var express = require('express');
var router = express.Router();
var passport = require('passport');
var Account = require('../models/account');


router.get('/:username', function(req, res) {
  Account.findOne({'username': req.params.username}, function(err, user) {
    if (!err) {
      if (req.user) {
        // admins and site owner can access the site
        // maybe change to isprivate flag?
        if (req.params.username == req.user.username || req.user.isAdmin) {
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