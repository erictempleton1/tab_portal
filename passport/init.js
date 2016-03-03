var login = require('./login');
var signup = require('./signup');
var User = require('../models/user');

modules.exports = function(passport) {
    // passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function (user, done) {
        console.log('serializing user: ');
        console.log(user);
        done(null, user._id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            console.log('deserializing user: ');
            console.log(user);
            done(err, user);
        });
    });

    // set up Passport Strategies for Login and Signup
    login(passport);
    signup(passport);
}