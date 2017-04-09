var express = require('express'),
    router = express.Router(),
    util = require('../../utility/utility'),
    AdminActivity = require('../../models/adminActivity');


/**
 * Render admin index
 */
router.get('/', util.ensureAdmin, function (req, res) {
    AdminActivity.find({}).exec()
    .then(function(activities) {
        console.log(activities);
        res.render('admin/admin', {user: req.user, activities: activities});
    })
    .catch(function(err) {
        console.log(err);
        var errMsg = 'Error loading activities';
        res.render('admin/admin', {user: req.user, activities: [{error: errMsg}]})
    });
});

module.exports = router;
