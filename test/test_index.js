process.env.NODE_ENV = 'testing';

var app = require('../app'),
    chai = require('chai'),
    chaiHttp = require('chai-http'),
    assert = chai.assert

chai.use(chaiHttp);

describe('GET index', function() {
    it('should respond with HTTP 200', function(done) {
        chai.request(app)
        .get('/')
        .end(function(err, res) {
            assert.equal(res.statusCode, 200);
            done();
        });
    });
});
