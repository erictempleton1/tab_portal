var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Sites = new Schema({
    createdDate: Date,
    editedDate: Date,
    allowedUsers: Array,
    slug: String,
    vizUrl: String,
    siteName: String,
    isTabServerViz: Boolean,
    trustedLogin: Boolean
});

module.exports = mongoose.model('Sites', Sites);
