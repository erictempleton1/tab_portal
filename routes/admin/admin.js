var express = require('express'),
    router = express.Router(),
    util = require('../../utility/utility'),
    AccountActivity = require('../../models/adminActivity');


/**
 * Render admin index
 */
router.get('/', util.ensureAdmin, function (req, res) {
    AdminActivity.find({}).exec()
    .then(function(activities) {
        res.render('admin/admin', {user: req.user, activities: actvities});
    })
    .catch(function(err) {
        var errMsg = 'Error loading activities';
        res.render('admin/admin', {user: req.user, activites: [{error: errMsg}]})
    });
});

module.exports = router;
