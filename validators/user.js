// user page user.js validators

exports.validateUserPasswordPost = function(req, res, next) {
    req.checkBody('password', 'Invalid password').notEmpty();
    req.checkParams('username', 'Invalid username').notEmpty();
    req.getValidationResult()
    .then(function(valResult) {
        if (valResult.isEmpty()) {
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