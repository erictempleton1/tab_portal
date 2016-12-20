var express = require('express'),
    router = express.Router();

/**
 * Render admin index
 */
router.get('/', function (req, res) {
    if (req.user && req.user.isAdmin) {
        res.render('admin/admin', {user: req.user});
    } else {
        req.flash('info', 'Unauthorized');
        res.redirect(403, '/');
    }
});

module.exports = router;
