var express = require('express'),
    router = express.Router(),
    util = require('../../utility/utility');


/**
 * Render admin index
 */
router.get('/', util.ensureAdmin, function (req, res) {
    res.render('admin/admin', {user: req.user});
});

module.exports = router;
