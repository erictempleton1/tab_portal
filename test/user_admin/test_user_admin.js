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

    describe('POST edit user unknown', function() {
        it('should redirect to users page for unknown user param', function(done) {
            agent
            .post('/login')
            .send({username: 'admin', password: 'admin'})
            .then(function() {
                agent
                .post('/admin/users/edit/eric1')
                .then(function(res) {
                    assert(res.redirects.length === 1);
                    assert(res.redirects[0].endsWith('/users'));
                    done();
                });
            });
        });
    });

    describe('POST edit user', function() {
        it('should update non-admin user to an admin', function(done) {
            agent
            .post('/login')
            .send({username: 'admin', password: 'admin'})
            .then(function() {
                agent
                .post('/admin/users/edit/eric')
                .send({username: 'eric', isAdmin: true})
                .then(function(res) {
                    Account.findOne({username: 'eric'}).exec()
                    .then(function(result) {
                        assert(result.isAdmin);
                    });
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