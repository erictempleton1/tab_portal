var express = require('express'),
    router = express.Router(),
    moment = require('moment'),
    util = require('../../utility/utility');

/**
 * Render settings page for admins to view config and other settings.
 */
router.get('/', util.ensureAdmin, function (req, res) {
    res.render(
        'admin/settings',
        {user: req.user}
    );
});

module.exports = router;
