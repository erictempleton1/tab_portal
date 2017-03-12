process.env.NODE_ENV = 'testing';

var app = require('../../app'),
    chai = require('chai'),
    chaiHttp = require('chai-http'),
    assert = chai.assert,
    agent = chai.request.agent(app),
    MongoClient = require('mongodb').MongoClient,
    dbSettings = require('../../db_config'),
    Account = require('../../models/account');

chai.use(chaiHttp);

describe('admin test', function() {
    before(function(done) {
        MongoClient.connect(dbSettings.dbUri.testing)
        .then(function(dbConn) {
            dbConn.dropDatabase(function( err, result) {
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
            });
        })
        .then(function() {
            var newUser = {
                username: 'eric',
                isAdmin: false,
                regDate: Date.now(),
                lastLogin: Date.now()
            };
            Account.register(new Account(newUser), 'eric', function(err, user) {
                if (err) {
                    console.log(err);
                }
                done();
            });
        });
    });

    describe('GET admin', function() {
        it('should return HTTP 200 with no redirects', function(done) {
            agent
            .post('/login')
            .send({username: 'admin', password: 'admin'})
            .then(function() {
                agent
                .get('/admin')
                .then(function(res) {
                    assert(res.statusCode === 200);
                    assert(res.redirects.length === 0);
                    done();
                });
            });
        });
    });

    describe('GET admin edit user', function() {
        it('should return HTTP 200 with no redirects', function(done) {
            agent
            .post('/login')
            .send({username: 'admin', password: 'admin'})
            .then(function() {
                agent
                .get('/admin/users/edit/eric')
                .then(function(res) {
                    assert(res.statusCode === 200);
                    assert(res.redirects.length === 0);
                    done();
                });
            });
        });
    });

    describe('GET admin edit user password', function() {
        it('should return HTTP 200 with no redirects', function(done) {
            agent
            .post('/login')
            .send({username: 'admin', password: 'admin'})
            .then(function() {
                agent
                .get('/admin/users/edit/password/eric')
                .then(function(res) {
                    assert(res.statusCode === 200);
                    assert(res.redirects.length === 0);
                    done();
                });
            });
        });
    });

    describe('GET admin remove user', function() {
        it('should return HTTP 200 with no redirects', function(done) {
            agent
            .post('/login')
            .send({username: 'admin', password: 'admin'})
            .then(function() {
                agent
                .get('/admin/users/remove/eric')
                .then(function(res) {
                    assert(res.statusCode === 200);
                    assert(res.redirects.length === 0);
                    done();
                });
            });
        });
    });

    describe('GET admin new user', function() {
        it('should return HTTP 200 with no redirects', function(done) {
            agent
            .post('/login')
            .send({username: 'admin', password: 'admin'})
            .then(function() {
                agent
                .get('/admin/users/new')
                .then(function(res) {
                    assert(res.statusCode === 200);
                    assert(res.redirects.length === 0);
                    done();
                });
            });
        });
    });

    describe('POST edit user', function() {
        it('should change user info in db', function(done) {
            agent
            .post('/login')
            .send({username: 'admin', password: 'admin'})
            .then(function() {
                agent
                .post('/admin/users/edit/eric1')
                .send({})
                .then(function(res) {
                    console.log(res.redirects);
                    done();
                });
            });
        });
    });

    after(function(done) {
        MongoClient.connect(dbSettings.dbUri.testing)
        .then(function(dbConn) {
            dbConn.dropDatabase(function(err, result) {
                if (err) {
                    console.log(err);
                }
                done();
            });
        });
    });
});