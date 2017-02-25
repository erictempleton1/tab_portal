process.env.NODE_ENV = 'testing';

var app = require('../app'),
    chai = require('chai'),
    chaiHttp = require('chai-http'),
    assert = chai.assert;

describe('GET logout', function() {
    it('should redirect to index', function(done) {
        chai.request(app)
        .get('/logout')
        .end(function(err, res) {
            assert.equal(res.statusCode, 200);
            assert.equal(res.redirects.length, 1);
            assert(res.redirects[0].endsWith('/'));
            done;
        });
    });
});
