var express = require('express');
var router = express.Router();
var passport = require('passport');
var Account = require('../models/account');
var request = require('request');


router.get('/', function(req, res) {
    res.render('admin');
});

module.exports = router;