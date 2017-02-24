process.env.NODE_ENV = 'testing';

var app = require('../../app'),
    chai = require('chai'),
    chaiHttp = require('chai-http'),
    assert = chai.assert,
    MongoClient = require('mongodb').MongoClient,
    dbSettings = require('../../db_config'),
    Account = require('../../models/account');

chai.use(chaiHttp);

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
