var request = require('request');
var config = require('../config');
var parseString = require('xml2js').parseString;


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
                var parsedToken = result['tsResponse']['credentials'][0]['$']['token'];
                callback(null, parsedToken);
            });
        }
    });
}
