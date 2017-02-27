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


/*
describe('POST login with valid credentials', function() {
    it('should redirect to user page', function(done) {
        chai.request(app)
        .post('/login')
        .send({username: 'eric', password: 'eric'})
        .end(function(err, res) {
            console.log(res.redirects);
            done();
        });
    });
});
*/

/*
describe('Test create user', function() {
-    var db;
-    before(function() {
-        MongoClient.connect(dbSettings.dbUri.testing)
-        .then(function(dbConn){
-            db = dbConn;
-            db.dropDatabase(function(err, result) {
-                assert.isFalse(err);
-            });
-        });
-
-        // create admin user
-        var regInfo = {
-                username: 'eric',
-                isAdmin: true,
-                regDate: Date.now(),
-                lastLogin: Date.now()
-            };
-        Account.register(new Account(regInfo), 'eric', function(err, user) {
-            // TODO - figure out what's going on here. no user created? not executing?'
-            console.log(user);
-        });
-    });
-
-    // TODO - add user login tests here!
-
-    after(function() {
-        db.dropDatabase(function(err, result) {
-            assert.isFalse(err);
-        });
-    });
-});
-
-
-
-describe('test create user', function() {
-    it('should create a new user', function(done) {
-        // create admin user
-        var regInfo = {
-                username: 'eric',
-                isAdmin: true,
-                regDate: Date.now(),
-                lastLogin: Date.now()
-            };
-        Account.register(new Account(regInfo), 'eric', function(err, user) {
-            console.log(user);
-            assert(user);
-            done();
-        });
-    });
-});
-*/

// todo tests:
// create user and test valid login
// test invalid username
// test invalid password
// incomplete post
// test already logged in redirect
