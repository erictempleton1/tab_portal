var request = require('request');
var config = require('../config');
var parseString = require('xml2js').parseString;


var getTabServerToken = function() {
    var tabReqUrl = config.tabServer.baseUrl + 'api/2.0/auth/signin';
    var formData = '<tsRequest><credentials name=' + '"' + config.tabServer.username + '" ' +
                    'password=' + '"' + config.tabServer.password + '"' +
                     '><site contentUrl="" /></credentials></tsRequest>'
    var headers = {'Content-Type': 'application/xml'}; 
    console.log(formData);
    console.log(tabReqUrl);

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
                var parsedResp = result;
                console.log(parsedResp['tsResponse']['credentials'][0]['$']['token']);
            });
        }
    });
}

module.exports = getTabServerToken;