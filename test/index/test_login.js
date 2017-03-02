process.env.NODE_ENV = 'testing';

var app = require('../../app'),
    chai = require('chai'),
    chaiHttp = require('chai-http'),
    assert = chai.assert,
    MongoClient = require('mongodb').MongoClient,
    dbSettings = require('../../db_config'),
    Account = require('../../models/account'),
    agent = chai.request.agent(app);

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

    describe('POST login valid and GET login', function() {
        it('should redirect home', function(done) {
            agent
            .post('/login')
            .send({username: 'eric', password: 'eric'})
            .then(function(res) {
                assert.equal(res.statusCode, 200);
                assert.equal(res.redirects.length, 1);
                assert(res.redirects[0].endsWith('/user/eric'));
                return agent.get('/login')
                .then(function(res) {
                    assert.equal(res.redirects.length, 1);
                    assert(res.redirects[0].endsWith('/'));
                    done();
                });
            });
        });
    });

    afterEach(function(done) {
        chai.request(app)
        .get('/logout')
        .end(function(err, res) {
            if (err) { 
                console.log(err); 
            }
        });
        done();
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
