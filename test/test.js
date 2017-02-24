process.env.NODE_ENV = 'testing';

var app = require('../app'),
    chai = require('chai'),
    chaiHttp = require('chai-http'),
    assert = chai.assert,
    MongoClient = require('mongodb').MongoClient,
    dbSettings = require('../db_config'),
    Account = require('../models/account');

chai.use(chaiHttp);

/*
describe('Test create user', function() {
    var db;
    before(function() {
        MongoClient.connect(dbSettings.dbUri.testing)
        .then(function(dbConn){
            db = dbConn;
            db.dropDatabase(function(err, result) {
                assert.isFalse(err);
            });
        });

        // create admin user
        var regInfo = {
                username: 'eric',
                isAdmin: true,
                regDate: Date.now(),
                lastLogin: Date.now()
            };
        Account.register(new Account(regInfo), 'eric', function(err, user) {
            // TODO - figure out what's going on here. no user created? not executing?'
            console.log(user);
        });
    });

    // TODO - add user login tests here!

    after(function() {
        db.dropDatabase(function(err, result) {
            assert.isFalse(err);
        });
    });
});
*/

/*
describe('test create user', function() {
    it('should create a new user', function(done) {
        // create admin user
        var regInfo = {
                username: 'eric',
                isAdmin: true,
                regDate: Date.now(),
                lastLogin: Date.now()
            };
        Account.register(new Account(regInfo), 'eric', function(err, user) {
            console.log(user);
            assert(user);
            done();
        });
    });
});
*/

describe('GET admin unauthorized', function() {
    it('should redirect to home', function(done) {
        chai.request(app)
        .get('/admin')
        .end(function(err, res) {
            assert.equal(res.redirects.length, 1);
            assert(res.redirects[0].endsWith('/'));
            done();
        });
    });
});
