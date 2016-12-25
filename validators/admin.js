exports.validateNewSitePost = function(req, res, next) {
    req.checkBody('siteName', 'Invalid site name').notEmpty();
    req.checkBody('vizUrl', 'Invalid site url').notEmpty();
    req.checkBody('allowedUsers', 'Invalid allowed users list').notEmpty();
    req.checkBody('isTabServerViz', 'Invalid tab server viz setting').notEmpty().isBoolean();
    req.checkBody('trustedLogin', 'Invalid trusted login setting').notEmpty().isBoolean();
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
}

exports.validateSiteEditPost = function(req, res, next) {
    req.checkBody('siteName', 'Invalid site name').notEmpty();
    req.checkBody('vizUrl', 'Invalid site url').notEmpty();
    req.checkBody('allowedUsers', 'Invalid allowed users list').notEmpty();
    req.checkBody('isTabServerViz', 'Invalid tab server viz setting').notEmpty().isBoolean();
    req.checkBody('trustedLogin', 'Invalid trusted viz setting').notEmpty().isBoolean();
    req.checkParams('sitename', 'Invalid sitename parameter').notEmpty();
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

exports.validateSiteRemovePost = function(req, res, next) {
    req.checkParams('sitename', 'Missing parameter').notEmpty();
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