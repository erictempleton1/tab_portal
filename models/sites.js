var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Sites = new Scehma({
    createdDate: Date,
    editedDate: Date,
    username: String,
    siteUrl: String
});

Sites.plugin(passportLocalMongoose);

module.exports = mongoose.model('Sites', Sites);