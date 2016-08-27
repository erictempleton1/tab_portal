var express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    Account = require('../../models/account'),
    Sites = require('../../models/sites'),
    util = require('../../utility/utility');

router.get('/', function (req, res) {
    // page for listing all users
    if (req.user && req.user.isAdmin) {
        Account.find({}).exec()
        .then(function (users) {
            res.render('admin/users_list', {users: users, user: req.user});
        }).catch(function (err) {
            req.flash('info', 'Error getting users >> ' + err);
            res.redirect('/admin');
        });
    } else {
        req.flash('info', 'Unauthorized');
        res.redirect('/');
    }
});

router.get('/edit/:username', function (req, res) {
    // admin can view/edit a single user
    if (req.user && req.user.isAdmin) {
        // query the single user using the _id param
        // todo - might need to change this to username instead!
        Account.findOne({username: req.params.username}).exec()
        .then(function (user) {
            res.render('admin/user_edit', {user: user});
        }).catch(function (err) {
            req.flash('info', 'Error querying user >> ' + err);
            res.redirect('/admin/users');
        });
    } else {
        req.flash('info', 'Unauthorized');
        res.redirect(302, '/');
    }
});

// todo - switch out ejs to use username instead of _id
router.post('/edit/:username', function(req, res) {
    // post request to edit a single user
    if (req.user && req.user.isAdmin) {
        var checkAccountQueries = [
            Account.findOne({username: req.params.username}).exec(),
            Account.findOne({username: req.body.username}).exec()
        ];
        // run the two queries in paralell
        Promise.all(checkAccountQueries).then(function (userResults) {
            var user = userResults[0],
                existingUser = userResults[1];
            if (!user) {
                req.flash('info', 'User not found');
                res.redirect('/admin/sites');
            } else if (!existingUser || existingUser.username === user.username) {
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
    } else {
        req.flash('info', 'Unauthorized');
        res.redirect(302, '/');
    }
});

router.get('/remove/:username', function (req, res) {
    // page for confirming user deletion
    if (req.user && req.user.isAdmin) {
        Account.findOne({username: req.params.username}).exec()
        .then(function (user) {
            res.render('admin/remove_user', {user: user});
        }).catch(function (err) {
            req.flash('info', 'There was an error loading user >> ' + err);
            res.redirect('/admin/users');
        });
    } else {
        req.flash('info', 'Unauthorized');
        res.redirect('/');
    }
});

router.post('/remove/:username', function (req, res) {
    // post request to delete a user
    if (req.user && req.user.isAdmin) {
        Account.remove({username: req.params.username}).exec()
        .then(function (user) {
            req.flash('info', 'User removed');
            res.redirect('/admin/users');
        }).catch(function (err) {
            req.flash('info', 'An error occurred deleting user');
            res.redirect('/admin/users');
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
            username: util.cleanString(req.body.username),
            isAdmin: false,
            regDate: Date.now(),
            lastLogin: Date.now()
        };
        Account.register(new Account(regInfo), req.body.password, function (err, account) {
        if (err) {
            req.flash("info", "Sorry, this account already exists");
            res.render('admin/add_user');
        } else {
            req.flash('info', 'User created');
            res.redirect('/admin/users');
        }
      });
    } else {
        req.flash('info', 'Unauthorized');
        res.redirect(302, '/');
    }
});

module.exports = router;