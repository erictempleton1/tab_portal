var request = require('request'),
    config = require('../config'),
    parseString = require('xml2js').parseString,
    Promise = require('bluebird');


exports.getTabServerToken = function(callback) {
    var tabReqUrl = config.tabServer.baseUrl + 'api/2.0/auth/signin';
    var formData = '<tsRequest><credentials name=' + '"' + config.tabServer.username + '" ' +
                    'password=' + '"' + config.tabServer.password + '"' +
                     '><site contentUrl="" /></credentials></tsRequest>'
    var headers = {'Content-Type': 'application/xml'}; 
    var options = {
        url: tabReqUrl,
        body: formData,
        headers: headers
    };
    request.post(options, function(err, resp, body) {
        if (err) {
            console.log(err)
        } else {
            parseString(body, function(err, result) {
                if (resp.statusCode == 200) {
                    var parsedResp = result['tsResponse']['credentials'][0]['$']['token'];
                } else {
                    var parsedResp = result;
                }
                callback(null, parsedResp);
            });
        }
    });
}

exports.getTrustedTicket = function(username, siteName) {
    var ticketReqUrl = config.tabServer.baseUrl + 'trusted',
        formData = {username: username, target_site: siteName},
        options = {
            uri: ticketReqUrl,
            body: formData,
        };
    return new Promise(function (resolve, reject) {
        request.post(options.uri, {form: formData}, function (err, res, body) {
            if (err) {
                return reject(err);
            } else if (res.statusCode === 500) {
                err = new Error('Unexpected status code ' + res.statusCode);
                return reject(err);
            }
            return resolve(body);
        });
    });
}
