var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Sites = new Scehma({
    createdDate: Date,
    editedDate: Date,
    username: String,
    siteUrl: String
});

module.exports = mongoose.model('Sites', Sites);
