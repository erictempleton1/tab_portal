var express = require('express'),
    router = express.Router(),
    moment = require('moment'),
    util = require('../../utility/utility');

/**
 * Render settings page for admins to view config and other settings.
 */
router.get('/', util.ensureAdmin, function (req, res) {
    res.send('In progress...');
});

module.exports = router;
