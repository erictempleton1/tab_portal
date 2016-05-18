var express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    Account = require('../../models/account'),
    Sites = require('../../models/sites'),
    util = require('../../utility/utility');

router.get('/', function (req, res) {
    // page for listing all users
    if (req.user && req.user.isAdmin) {
        Account.find({}, function (err, users) {
            if (err) {
                req.flash('info', 'There was an error loading users >> ' + err);
                res.redirect('admin');
            } else {
                res.render('admin/users_list', {users: users});
            }
        });
    } else {
        req.flash('info', 'Unauthorized');
        res.redirect('/');
    }
});

router.get('/edit/:id', function (req, res) {
    // admin can view/edit a single user
    if (req.user && req.user.isAdmin) {
        // query the single user using the _id param
        Account.findOne({_id: req.params.id}, function (err, user) {
            if (err) {
                req.flash("info", "User not found");
                res.redirect(301, '/admin');
            } else {
                res.render('admin/user_edit', {user: user});
            }
        });
    } else {
        req.flash('info', 'Unauthorized');
        res.redirect(302, '/');
    }
});

router.post('/edit/:id', function(req, res) {
    // post request to edit a single user
    if (req.user && req.user.isAdmin) {
        Account.findOne({_id: req.params.id}, function (err, user) {
            if (err) {
                req.flash('info', 'An error occurred');
                res.redirect('/admin/users');
            } else {
                // check for existing username
                Account.findOne({username: req.body.username}, function (existingErr, existingUser) {
                    if (existingErr) {
                        req.flash('info', 'Existing user query error');
                        res.redirect('/admin/users');
                    } else if (!existingUser || existingUser.username === user.username) {
                        // users can keep the same username or change to one not in use
                        user.username = req.body.username;
                        user.isAdmin = req.body.isAdmin;
                        user.save();
                        req.flash('info', 'User updated!');
                        res.redirect('/admin/users');
                    } else {
                        req.flash('info', 'Username already in use');
                        res.redirect('/admin/users');
                    }
                });
            }
        });
    } else {
        req.flash('info', 'Unauthorized');
        res.redirect(302, '/');
    }
});

router.get('/remove/:id', function (req, res) {
    // page for confirming user deletion
    if (req.user && req.user.isAdmin) {
        Account.findOne({_id: req.params.id}, function (err, user) {
            if (err) {
                req.flash('info', 'An error occurred finding user');
                res.redirect('/admin/users');
            } else {
                res.render('admin/remove_user', {user: user});
            }
        });
    } else {
        req.flash('info', 'Unauthorized');
        res.redirect('/');
    }
});

router.post('/remove/:id', function (req, res) {
    // post request to delete a user
    if (req.user && req.user.isAdmin) {
        Account.remove({_id: req.params.id}, function (err, user) {
            if (err) {
                req.flash('info', 'An error occurred deleting user');
                res.redirec('/admin/users');
            } else {
                req.flash('info', 'User removed!');
                res.redirect('/admin/users');
            }
        });
    } else {
        req.flash('info', 'Unauthorized');
        res.redirect('/');
    }
});

router.get('/new', function (req, res) {
    // form for adding a new user
    if (req.user && req.user.isAdmin) {
        res.render('admin/add_user');
    } else {
        req.flash('info', 'Unauthorized');
        res.redirect(302, '/');
    }
});

router.post('/new', function (req, res) {
    // post request for adding a new user
    if (req.user && req.user.isAdmin) {
        var regInfo = {
            username: req.body.username,
            isAdmin: false,
            regDate: Date.now(),
            lastLogin: Date.now(),
        };
        Account.register(new Account(regInfo), req.body.password, function (err, account) {
        if (err) {
          req.flash("info", "Sorry, this account already exists");
          return res.render('admin/add_user')
        }
        passport.authenticate('local')(req, res, function() {
          res.redirect('/admin/users');
        });
      });
    } else {
        req.flash('info', 'Unauthorized');
        res.redirect(302, '/');
    }
});

module.exports = router;