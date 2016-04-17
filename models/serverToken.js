var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ServerToken = new Schema({
    refreshDate: Date,
    token: String
});

module.exports = mongoos.model('ServerToken', ServerToken);
