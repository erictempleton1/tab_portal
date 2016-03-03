var express = require('express');
var router = express.Router();

/* log a user in */
router.get('/', function(req, res, next) {
    res.send('Login page');
});

module.exports = router;