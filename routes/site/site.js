var express = require('express'),
    router = express.Router(),
    util = require('../../utility/utility'),
    tabServerUtil = require('../../utility/tabServerAuth'),
    Account = require('../../models/account'),
    Sites = require('../../models/sites');

// TODO - move this to util
function ticketUrl (siteUrl, trustedTicket) {
    // todo - add more url checks? index of views?
    var splitUrl = siteUrl.split("/t/"),
        finalUrl;
    if (splitUrl.length > 1) {
        finalUrl = splitUrl[0] + "/trusted/" + trustedTicket + "/t/" + splitUrl[1];
        return finalUrl;
    } else {
        finalUrl = false;
    }
}
    
router.get('/:sitename', util.ensureUser, function (req, res) {
    // render the site page that displays the given workbook
    Sites.findOne({siteName: req.params.sitename}).exec()
    .then(function (site) {
        if (site) {
            // make sure that the user is allowed to view the site or an admin
            if (site.allowedUsers.indexOf(req.user.username) >= 0 || req.user.isAdmin) {
                var renderUrl;
                if (site.isTabServerViz) {
                    // todo - update this!
                    /*
                    tabServerUtil.getTrustedTicket(req.user.username, req.params.sitename).
                    then(function (ticket) {
                        // try to build the url and pass to template
                        renderUrl = ticketUrl(site.siteUrl, ticket);
                        if (renderUrl) {
                            res.render('site/site_page', {
                                site: site,
                                user: req.user,
                                renderUrl: renderUrl
                            });
                        } else {
                            req.flash('info', 'Error building render url');
                            res.redirect('/');
                        }
                    }).catch(function (err) {
                        req.flash('info', 'Error loading site');
                        res.redirect('/');
                    });
                    */
                } else {
                    // set non-tab server url
                    renderUrl = site.vizUrl;
                    res.render('site/site_page', {
                        site: site,
                        user: req.user,
                        renderUrl: renderUrl
                    });
                }
            } else {
                req.flash('info', 'User is not authorized to view this site');
                res.redirect('/');
            }
        } else {
            req.flash('info', 'Site not found');
            res.redirect('/');
        }
    }).catch(function (err) {
        req.flash('info', 'There was an error loading site >> ' + err);
        res.redirect('/');
    });
});

module.exports = router;