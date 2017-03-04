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

describe('admin tests', function() {
    before(function(done) {
        MongoClient.connect(dbSettings.dbUri.testing)
        .then(function(dbConn) {
            dbConn.dropDatabase(function(err, result) {
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
            chai.request(app)
            .post('/login')
            .send({username: 'admin', password: 'admin'})
            .end(function(err, res) {
                if (err) {
                    console.log(err);
                }
                done();
            });
        });
    });

    describe('GET admin page', function() {
        it('should return admin page', function(done) {
            chai.request(app)
            .get('/admin')
            .end(function(err, res) {
                console.log(res.redirects);
                done();
            });
        });
    });

    describe('login and test admin GET', function() {
        it('should return valid admin page', function(done) {
            agent
            .post('/login')
            .send({username: 'admin', password: 'admin'})
            .then(function(res) {
                assert(res.redirects[0].endsWith('/admin'));
                return agent.get('/admin')
                .then(function(res) {
                    assert.equal(res.statusCode, 200);
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
            });
        });
        done();
    });
});
