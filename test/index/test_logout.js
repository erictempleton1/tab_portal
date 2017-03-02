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

describe('logout tests', function() {
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
                username: 'tom',
                isAdmin: false,
                regDate: Date.now(),
                lastLogin: Date.now()
            };
            Account.register(new Account(regInfo), 'tom', function(err, user) {
                if (err) {
                    console.log(err);
                }
                done();
            });
        });
    });

    describe('GET logout after login', function() {
        it('should redirect home', function(done) {
            agent
            .post('/login')
            .send({username: 'tom', password: 'tom'})
            .then(function(res) {
                assert.equal(res.statusCode, 200);
                assert.equal(res.redirects.length, 1);
                assert(res.redirects[0].endsWith('/user/tom'));
                return agent.get('/logout')
                .then(function(res) {
                    assert.equal(res.redirects.length, 1);
                    assert(res.redirects[0].endsWith('/'));
                    done();
                });
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
