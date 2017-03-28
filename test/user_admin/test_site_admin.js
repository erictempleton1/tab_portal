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

describe('admin site tests', function() {
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
                    console.log(error);
                }
                done();
            });
        });
    });

    describe('GET sites listing', function() {
        it('should return HTTP 200 with no redirect', function(done) {
            agent
            .post('/login')
            .send({username: 'admin', password: 'admin'})
            .then(function() {
                agent
                .get('/admin/sites')
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