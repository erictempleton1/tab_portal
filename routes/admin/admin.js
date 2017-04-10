var express = require('express'),
    router = express.Router(),
    util = require('../../utility/utility'),
    AdminActivity = require('../../models/adminActivity'),
    moment = require('moment');


// todo - add moment formatted date to ejs

/**
 * Render admin index
 */
router.get('/', util.ensureAdmin, function (req, res) {
    AdminActivity.find({}).exec()
    .then(function(activities) {
        console.log(activities);
        res.render(
            'admin/admin', 
            {
                user: req.user, 
                activities: activities,
                moment: moment
            }
        );
    })
    .catch(function(err) {
        console.log(err);
        var errMsg = 'Error loading activities';
        res.render(
            'admin/admin', 
            {
                user: req.user, 
                activities: [{error: errMsg}],
                moment: moment
            }
        );
    });
});

module.exports = router;
