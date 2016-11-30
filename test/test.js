var assert = require('assert'),
    express = require('express'),
    chai = require('chai'),
    chaiHttp = require('chai-http'),
    should = chai.should(),
    app = require('../app');

chai.use(chaiHttp);


describe('GET index', function() {
    it('should respond with HTTP 200', function(done) {
        chai.request(app)
        .get('/')
        .end(function(err, res) {
            res.should.have.status(200);
            done();
        });
    });
});

describe('GET login', function() {
    it('should respond with HTTP 200', function(done) {
        chai.request(app)
        .get('/login')
        .end(function(err, res) {
            res.should.have.status(200);
            done();
        });
    });
});

describe('GET admin unauthorized', function() {
    it('should respond with HTTP 403', function(done) {
        chai.request(app)
        .get('/admin')
        .end(function(err, res) {
            res.should.have.status(403);
            done();
        });
    });
});
