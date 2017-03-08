process.env.NODE_ENV = 'testing';

var app = require('../../app'),
    chai = require('chai'),
    chaiHttp = require('chai-http'),
    assert = chai.assert,
    MongoClient = require('mongodb').MongoClient,
    dbSettings = require('../../db_config'),
    Account = require('../../models/account');

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
