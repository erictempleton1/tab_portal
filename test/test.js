var assert = require('assert'),
    express = require('express'),
    chai = require('chai'),
    chaiHttp = require('chai-http'),
    should = chai.should(),
    app = require('../app');

process.env.NODE_ENV = 'testing';
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

// TODO - switch this directly to model and re-write
describe('POST add new admin user', function() {
    it('should send params to post and create an admins user', function(done){
        chai.request(app)
        .post('/')
        .set('content-type','application/x-www-form-urlencoded')
        .send(
            {
                username: 'admin',
                isAdmin: true,
                regDate: Date.now(),
                lastLogin: Date.now(),
                password: 'admin'
            }
        )
       .end(function(err, res) {
            res.should.have.status(200);
            done();
        })
    }) 
})
