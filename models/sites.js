var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Sites = new Scehma({
    createdDate: Date,
    editedDate: Date,
    allowedUsers: Array,
    siteUrl: String,
    isPrivate: Boolean
});

module.exports = mongoose.model('Sites', Sites);
