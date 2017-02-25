process.env.NODE_ENV = 'testing';

var app = require('../../app'),
    chai = require('chai'),
    chaiHttp = require('chai-http'),
    assert = chai.assert,
    MongoClient = require('mongodb').MongoClient,
    dbSettings = require('../../db_config'),
    Account = require('../../models/account');

chai.use(chaiHttp);

describe('GET login', function() {
    it('should respond with HTTP 200', function(done) {
        chai.request(app)
        .get('/login')
        .end(function(err, res) {
            assert.equal(res.statusCode, 200);
            done();
        });
    });
});

describe('POST login with empty body', function() {
    it('should redirect back to login page', function(done) {
        chai.request(app)
        .post('/login')
        .end(function(err, res) {
            assert.equal(res.redirects.length, 1);
            assert(res.redirects[0].endsWith('login'));
            done();
        });
    });
});

// todo tests:
// create user and test valid login
// test invalid username
// test invalid password
// incomplete post
// test already logged in redirect
