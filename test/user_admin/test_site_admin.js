process.env.NODE_ENV = 'testing';

var app = require('../../app'),
    chai = require('chai'),
    chaiHttp = require('chai-http'),
    assert = chai.assert,
    agent = chai.request.agent(app),
    MongoClient = require('mongodb').MongoClient,
    dbSettings = require('../../db_config'),
    Account = require('../../models/account'),
    Sites = require('../../models/sites');

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

    var newSite = {
        allowedUsers: ['admin'],
        vizUrl: 'http://google.com',
        trustedLogin: true,
        siteName: 'awesomesite',
        slug: 'awesomesite',
        isTabServerViz: true
    };

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

    describe('GET edit site page for unknown site', function() {
        it('should redirect back to sites listing page', function(done) {
            agent
            .post('/login')
            .send({username: 'admin', password: 'admin'})
            .then(function() {
                agent
                .get('/admin/sites/edit/madeupsite')
                .then(function(res) {
                    assert(res.redirects[0].endsWith('/admin/sites'));
                    done();
                });
            });
        });
    }); 

    describe('GET new site creation page', function() {
        it('should return HTTP 200 with no redirect', function(done) {
            agent
            .post('/login')
            .send({username: 'admin', password: 'admin'})
            .then(function() {
                agent
                .get('/admin/sites/new')
                .then(function(res) {
                    assert(res.statusCode === 200);
                    assert(res.redirects.length === 0);
                    done();
                });
            });
        });
    });

    describe('POST new site page', function() {
        it('should create a new site', function(done) {
            agent
            .post('/login')
            .send({username: 'admin', password: 'admin'})
            .then(function() {
                agent
                .post('/admin/sites/new')
                .send(newSite)
                .then(function(res) {
                    Sites.findOne({siteName: 'awesomesite'}).exec()
                    .then(function(result) {
                        assert(result !== null);
                        assert(result.siteName === 'awesomesite');
                    });
                    done();
                });
            });
        });
    });

    describe('POST site name already in use', function() {
        it('should not create a new site', function(done) {
            agent
            .post('/login')
            .send({username: 'admin', password: 'admin'})
            .then(function() {
                agent
                .post('/admin/sites/new')
                .send(newSite)
                .then(function() {
                    agent
                    .post('/admin/sites/new')
                    .send(newSite)
                    .then(function(res) {
                        Sites.find({siteName: 'awesomesite'}).exec()
                        .then(function(result) {
                            assert(result.length === 1);
                        });
                        done();
                    });
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