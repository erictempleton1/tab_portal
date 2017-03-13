var express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    moment = require('moment'),
    Account = require('../../models/account'),
    Sites = require('../../models/sites'),
    util = require('../../utility/utility'),
    valAdmin = require('../../validators/admin');


router.get('/', util.ensureAdmin, function (req, res) {
    // page for listing all users
    Account.find({}).exec()
    .then(function (users) {
        res.render(
            'admin/users_list',
            {
                users: users,
                user: req.user,
                moment: moment
            }
        );
    }).catch(function (err) {
        util.log(3, 'users get request error: ' + err);
        req.flash('info', 'Error getting users');
        res.redirect('/admin');
    });
});

router.get('/edit/:username', util.ensureAdmin, function (req, res) {
    Account.findOne({username: req.params.username}).exec()
    .then(function (userEdit) {
        if (userEdit) {
            res.render('admin/user_edit', {userEdit: userEdit, user: req.user});
        } else {
            req.flash('info', 'Unable to find user');
            res.redirect('/admin/users');
        }
    }).catch(function (err) {
        util.log(3, 'user edit get request error: ' + err);
        req.flash('info', 'Error getting user');
        res.redirect('/admin/users');
    });
});

router.get('/edit/password/:username', util.ensureAdmin, function(req, res) {
    Account.findOne({username: req.params.username})
    .exec()
    .then(function(userEdit) {
        if (userEdit) {
            res.render(
                'admin/change_user_pw',
                {userEdit: userEdit, user: req.user}
            );
        } else {
            req.flash('info', 'Unable to find user');
            res.redirect('/admin/users');
        }
    })
    .catch(function (err) {
        util.log(3, 'user edit password get request error: ' + err);
        req.flash('info', 'Error getting user');
        res.redirect('/admin/users');
    });
});

router.post('/edit/password/:username', [util.ensureAdmin, valAdmin.validateUserPasswordPost], function(req, res) {
    Account.findOne({username: req.params.username})
    .exec()
    .then(function(userEdit) {
        if (userEdit) {
            userEdit.setPassword(req.body.password, function() {
                userEdit.save();
                req.flash('info', 'Password Updated');
                res.redirect('/admin/users');
            });
        } else {
            req.flash('info', 'Unable to find user');
            res.redirect('/admin/users');
        }
    })
    .catch(function (err) {
        util.log(3, 'user edit password post request error: ' + err);
        req.flash('info', 'Error getting user');
        res.redirect('/admin/users');
    });
});

router.post('/edit/:username', [util.ensureAdmin, valAdmin.validateUserEditPost], function(req, res) {
    // post request to edit a single user
    var checkAccountQueries = [
        Account.findOne({username: req.params.username}).exec(),
        Account.findOne({username: req.body.username}).exec()
    ];
    // run the two queries in paralell
    Promise.all(checkAccountQueries)
    .then(function (userResults) {
        var user = userResults[0],
            existingUser = userResults[1];
        if (!user) {
            req.flash('info', 'User not found');
            res.redirect('/admin/users');
        } else if (!existingUser || existingUser.username === user.username) {
            user.username = req.body.username;
            user.isAdmin = req.body.isAdmin;
            user.save();
            req.flash('info', 'User updated!');
            res.redirect('/admin/users/edit/' + req.params.username);
        } else {
            req.flash('info', 'Username already in use');
            res.redirect('/admin/users/edit/' + req.params.username);
        }
    })
    .catch(function(err) {
        util.log(3, 'user edit get request error: ' + err);
        req.flash('info', 'Error getting user');
        res.redirect('/admin/users');
    });
});

router.get('/remove/:username', util.ensureAdmin, function (req, res) {
    // page for confirming user deletion
    Account.findOne({username: req.params.username}).exec()
    .then(function (user) {
        if (user) {
            res.render('admin/remove_user', {user: user});
        } else {
            req.flash('info', 'Unable to find user');
            res.redirect('/admin/users');
        }
    }).catch(function (err) {
        util.log(3, 'user remove get request error:' + err);
        req.flash('info', 'Error getting user');
        res.redirect('/admin/users');
    });
});

router.post('/remove/:username', [util.ensureAdmin, valAdmin.validateUserRemovePost], function (req, res) {
    if (req.params.username !== req.user.username) {
        Account.remove({username: req.params.username}).exec()
        .then(function (user) {
            if (user) {
                // remove user from allowedUsers array in all docs
                Sites.update({}, {$pull: {allowedUsers: req.params.username}}, {multi: true}).exec()
                .then(function() {
                    req.flash('info', 'User removed');
                    res.redirect('/admin/users');  
                })
                .catch(function(siteErr) {
                    req.flash('info', 'Error removing user from sites')
                });
            } else {
                req.flash('info', 'Unable to find user');
                res.redirect('/admin/users');
            }
        }).catch(function (err) {
            util.log(3, 'user remove post request error: ' + err);
            req.flash('info', 'Error deleting user');
            res.redirect('/admin/users');
        });
    } else {
        // prevent admin users from delete themselves
        req.flash('info', 'Unable to delete current user');
        res.redirect('/admin/users');
    }
});

router.get('/new', util.ensureAdmin, function (req, res) {
    // form for adding a new user
    res.render('admin/add_user', {user: req.user});
});

router.post('/new', [util.ensureAdmin, valAdmin.validateNewUserPost], function (req, res) {
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
});

module.exports = router;