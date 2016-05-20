var express = require('express'),
    router = express.Router(),
    Account = require('../../models/account'),
    Sites = require('../../models/sites');
    
router.get('/:username', function (req, res) {
    // page to display sites a user is joined to
    res.send('placeholder for user page!');
});

module.exports = router;