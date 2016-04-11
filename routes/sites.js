var express = require('express');
var router = express.Router();
var passport = require('passport');
var Account = require('../models/account');


// todo - only auth'd users matching username should be able to access here
router.get('/:username', function(req, res) {
  Account.findOne({'username': req.params.username}, function(err, user) {
    if (!err) {
      // make sure the user is authorized for this page
      // maybe add a private flag in the db?
      // todo - redirect unauthorized users if private
      if (req.params.username == req.user.username && req.user) {
        res.render('user_page', {user: user.username});
      } else {
        req.flash("info", "Unauthorized");
        res.redirect('/');
      }
    } else {
      res.render('user_page', {user: 'error'});
    }
  });
});

module.exports = router;