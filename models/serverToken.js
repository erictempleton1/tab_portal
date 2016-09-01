var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ServerToken = new Schema({
    refreshDate: Date,
    tabServerToken: String
});

module.exports = mongoose.model('ServerToken', ServerToken);
