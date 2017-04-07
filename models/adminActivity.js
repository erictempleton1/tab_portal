var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

    var AdminActivity = new Schema({
        adminUserId: Schema.ObjectId,
        adminUsername: String,
        activity: String,
        activityDate: Date
    });

    module.exports = mongoose.model('AdminActivity', AdminActivity);
