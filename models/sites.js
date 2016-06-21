var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Sites = new Schema({
    createdDate: Date,
    editedDate: Date,
    allowedUsers: Array,
    siteUrl: String,
    siteName: String,
    isPrivate: Boolean,
    requestTrustedTicket: Boolean
});

module.exports = mongoose.model('Sites', Sites);
