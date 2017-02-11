var prompt = require('prompt');

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
        console.log('   username: ' + result.username);
        console.log('   password: ' + result.password);
    } else {
        console.log('Error - passwords do not match');
    }
});
