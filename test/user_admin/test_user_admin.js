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
        it('should return HTTP 200 for admin home', function(done) {
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
        it('should return HTTP 200 for edit user page', function(done) {
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