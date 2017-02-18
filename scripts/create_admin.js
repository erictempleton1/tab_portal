var prompt = require('prompt'),
    Account = require('../models/account'),
    util = require('../utility/utility');

var schema = {
    properties: {
        username: {
            pattern:  /^[a-zA-Z\s\-]+$/,
            message: 'Username must contain only letters, spaces, or dashes.',
            required: true,
            description: 'Enter username'
        },
        password: {
            hidden: true,
            required: true,
            description: 'Enter password'
        },
        confirmPassword: {
            hidden: true,
            required: true,
            description: 'Confirm password'
        }
    }
};

prompt.start();
prompt.get(schema, function(err, result) {
    if (result.password === result.confirmPassword) {
        var newAccount = new Account({
            username: util.cleanString(result.username),
            isAdmin: true,
            regDate: Date.now(),
            lastLogin: Date.now()
        });
        Account.register(newAccount, result.password, function(err, account) {
            if (err) {
                console.log('Username already in use. Please try another username');
            } else {
                console.log('Admin account created');
            }
        });
    } else {
        console.log('Error - passwords do not match');
    }
});

// TODO - mongoose deprecated warning being thrown and no account is added!
