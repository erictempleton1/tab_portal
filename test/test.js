var assert = require('assert'),
    express = require('express'),
    app = express(),
    chai = require('chai'),
    chaiHttp = require('chai-http'),
    should = chai.should();

chai.use(chaiHttp);

describe('GET index', function() {
    it('should respond', function(done) {
        chai.request(app)
            .get('/')
            .end(function(res){
                res.should.have.status(200);
                done();
            });
    });
});