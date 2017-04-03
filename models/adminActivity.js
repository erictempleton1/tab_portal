var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

    var AdminActivity = new Schema({
        adminUserId: Schema.ObjectId,
        activity: String,
        activityDate: Date
    });

    // todo - think about uniform activity object to reference? this could prevent random
    // activities from being added, or make it easier to reference.

    module.exports = mongoose.model('AdminActivity', AdminActivity);
