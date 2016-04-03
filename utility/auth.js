var request = require('request');
var config = require('../config');


var getTabServerToken = function() {
    var tabReqUrl = config.tabServer.baseUrl + 'api/2.0/auth/signin';
    var formData = '<tsRequest><credentials name=' + '"' + config.tabServer.username + '" ' +
                    'password=' + '"' + config.tabServer.password + '"' +
                     '><site contentUrl="" /></credentials></tsRequest>'
    console.log(formData);
    console.log(tabReqUrl);

    request.get(tabReqUrl, {form: {key: formData}}, function(err, resp, body) {
        if (err) {
            console.log(err)
        } else {
            console.log(body)
        }
    });
}

module.exports = getTabServerToken;