var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose');

mongoose.Promise = require('bluebird');

var Account = new Schema({
    username: String,
    password: String,
    isAdmin: Boolean,
    regDate: Date,
    lastLogin: Date,
    trustedTicket: String
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);
