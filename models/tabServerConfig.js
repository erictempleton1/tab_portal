var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TabServerConfig = new Schema({
    tabServerUsername: String,
    tabServerPassword: String,
    addedDate: Date,
    updatedDate: Date
});

module.exports = mongoose.model('TabServerConfig', TabServerConfig);
