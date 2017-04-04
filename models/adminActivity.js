var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

    var AdminActivity = new Schema({
        adminUserId: Schema.ObjectId,
        activity: String,
        activityDate: Date
    });

    module.exports = mongoose.model('AdminActivity', AdminActivity);
