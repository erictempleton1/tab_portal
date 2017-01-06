var express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    Account = require('../models/account'),
    util = require('../utility/utility'),
    Promise = require('bluebird');

// todo - add check for config collection
// allow user to create or skip. modify later in admin.


router.get('/', function (req, res) {
	Account.find({}).exec()
	.then(function (users) {
		if (users.length > 0) {
			res.render('index', {user: req.user});
		} else if (users.length == 0) {
			// no users have been found so prompt user to create an admin
			res.render('create_admin', {user: req.user});
		}
	}).catch(function (findErr) {
		util.log(3, 'index get request error: ' + findErr);
		req.flash('info', 'Error loading index');
		res.redirect('/');
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
					util.log(3, 'index post request error creating admin user: ' + regErr);
					req.flash('info', 'Error creating admin user');
					res.redirect('/');
				} else {
					req.flash('info', 'Admin user created. Please log in.');
					res.redirect('/login');
				}
			});
		}
	}).catch(function (findErr) {
		util.log(3, 'index post request error: ' + findErr);
		req.flash('info', 'Error loading index');
		res.redirect('/');
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

router.post('/login', passport.authenticate("local", failureMessages()), function (req, res) {
	// update the last login date
	var conditions = {'username': req.user.username},
		update = {'lastLogin': Date.now()},
		options = {'upsert': false};
    Account.update(conditions, update, options).exec()
	.then(function (user) {
		// send admin users to the admin site
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

function failureMessages() {
    return {
      failureRedirect: "/login",
      failureFlash: "Invalid username or password"
    };
};

module.exports = router;
