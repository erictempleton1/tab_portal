process.env.NODE_ENV = 'testing';

var app = require('../../app'),
    chai = require('chai'),
    chaiHttp = require('chai-http'),
    assert = chai.assert,
    MongoClient = require('mongodb').MongoClient,
    dbSettings = require('../../db_config'),
    Account = require('../../models/account');

chai.use(chaiHttp);

describe('login tests', function() {
    before(function(done) {
        MongoClient.connect(dbSettings.dbUri.testing)
        .then(function(dbConn) {
            dbConn.dropDatabase(function (err, result) {
                if (err) {
                    console.log(err);
                }
            });
        })
        .then(function() {
            var regInfo = {
                username: 'eric',
                isAdmin: false,
                regDate: Date.now(),
                lastLogin: Date.now()
            };
            Account.register(new Account(regInfo), 'eric', function(err, user) {
                if (err) {
                    console.log(err);
                }
            });
        })
        .then(function() {
            var regInfo = {
                username: 'admin',
                isAdmin: true,
                regDate: Date.now(),
                lastLogin: Date.now()
            };
            Account.register(new Account(regInfo), 'admin', function(err, user) {
                if (err) {
                    console.log(err);
                }
                done();
            });
        });
    });

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

    describe('POST login non-admin valid', function() {
        it('should redirect to user page', function(done) {
            chai.request(app)
            .post('/login')
            .send({username: 'eric', password: 'eric'})
            .end(function(err, res) {
                assert.equal(res.statusCode, 200);
                assert.isAbove(res.redirects.length, 1);
                assert(res.redirects[0].endsWith('/user/eric'));
                done();
            });
        });
    });

    describe('POST login admin valid', function() {
        it('should redirect to admin page', function(done) {
            chai.request(app)
            .post('/login')
            .send({username: 'admin', password: 'admin'})
            .end(function(err, res) {
                assert.equal(res.statusCode, 200);
                assert.isAbove(res.redirects.length, 1);
                assert(res.redirects[0].endsWith('/admin'));
                done();
            });
        });
    });

    describe('POST login invalid credentials', function() {
        it('should redirect to login', function(done) {
            chai.request(app)
            .post('/login')
            .send({username: 'eric', password: 'invalid'})
            .end(function(err, res) {
                assert.equal(res.statusCode, 200);
                assert.equal(res.redirects.length, 1);
                assert(res.redirects[0].endsWith('/login'));
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

    // TODO - work on this failing test
    describe('POST login then GET login page', function() {
        it('should redirect home', function(done) {
            chai.request(app)
            .get('/logout')
            .post('/login')
            .send({username: 'eric', password: 'eric'})
            .get('/login')
            .end(function(err, res) {
                console.log(res.redirects);
                done();
            });
        });
    });

    after(function(done) {
        MongoClient.connect(dbSettings.dbUri.testing)
        .then(function(dbConn) {
            dbConn.dropDatabase(function (err, result) {
                if (err) {
                    console.log(err);
                }
            });
        });
        done();
    });
});

// todo tests:
// create user and test valid login
// test invalid username
// test invalid password
// incomplete post
// test already logged in redirect
