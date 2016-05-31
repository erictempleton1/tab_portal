var express = require('express'),
    router = express.Router(),
    Account = require('../../models/account'),
    Sites = require('../../models/sites');
    
router.get('/:sitename', function (req, res) {
    res.send('Site!');
});

module.exports = router;