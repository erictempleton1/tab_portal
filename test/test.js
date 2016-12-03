var assert = require('assert'),
    express = require('express'),
    chai = require('chai'),
    chaiHttp = require('chai-http'),
    should = chai.should(),
    expect = chai.expect(),
    Account = require('../models/account');

process.env.NODE_ENV = 'testing';
chai.use(chaiHttp);
var app = require('../app');


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

describe('Create admin user', function() {
    it('should create admin user', function(done) {
        var regInfo = {
            username: 'eric',
            isAdmin: true,
            regDate: Date.now(),
            lastLogin: Date.now()
        };
        Account.register(new Account(regInfo), 'eric', function(err, user) {
            console.log(user);
            should.not.exist(err);
            done();
        })
    });
});
