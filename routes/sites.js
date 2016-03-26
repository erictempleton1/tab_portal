var express = require('express');
var router = express.Router();
var passport = require('passport');
var Account = require('../models/account');


// todo - only auth'd users matching username should be able to access here
router.get('/:username', function(req, res) {
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

module.exports = router;