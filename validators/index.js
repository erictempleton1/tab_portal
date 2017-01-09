// index index.js validators

exports.validateCreateAdminUser = function(req, res, next) {
    req.checkBody('username', 'Username required').notEmpty();
    req.getValidationResult()
    .then(function(valResult) {
        if (valResult) {
            return next();
        }
        res.status(400).json(
            {
                message: 'validation error',
                error: valResult.array()
            }
        );
    });
};