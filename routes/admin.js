var express = require('express');
var router = express.Router();
var passport = require('passport');
var Account = require('../models/account');
var request = require('request');
var config = require('../config');
var authUtil = require('../utility/auth');

router.get('/', function(req, res) {
    var testReq = new authUtil();
    console.log(testReq);
    res.render('admin');
});

router.post('/', function(req, res) {
    var testReq = new authUtil();
    console.log(testReq);
});

module.exports = router;