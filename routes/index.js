var express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    Account = require('../models/account'),
    util = require('../utility/utility'),
	valIndex = require('../validators/index'),
    Promise = require('bluebird');

// todo - add check for config collection
// allow user to create or skip. modify later in admin.


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

router.post('/login', passport.authenticate("local", util.failureMessages), function (req, res) {
	var conditions = {'username': req.user.username},
		update = {'lastLogin': Date.now()},
		options = {'upsert': false};
    Account.update(conditions, update, options).exec()
	.then(function (user) {
		if (req.user.isAdmin) {
			res.redirect('/admin');
		} else {
			res.redirect('/user/' + req.user.username);
		}
	}).catch(function (err) {
		util.log(3, 'login update document error: ' + err);
		req.flash('info', 'Error logging in');
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
