var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    encrypt = require('mongoose-encryption'),
    config = require('../config');


var TabServerConfig = new Schema({
    tabServerUsername: String,
    tabServerPassword: String,
    tabServerUrl: String,
    addedDate: Date,
    updatedDate: Date
});

module.exports = mongoose.model('TabServerConfig', TabServerConfig);
