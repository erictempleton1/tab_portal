var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

    var AdminActivity = new Schema({
        adminUserId: Schema.ObjectId,
        adminUsername: String,
        activityType: String,
        activityMessage: String,
        activityArea: String,
        activityDate: Date
    });

    module.exports = mongoose.model('AdminActivity', AdminActivity);
