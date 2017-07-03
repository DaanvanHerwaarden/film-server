var chai = require('chai');
var chaiHttp = require('chai-http');
var chould = chai.should();
var index = require("../index.js");

chai.use(chaiHttp);

describe('Auth API v1', function() {
    it('returns UnauthorizedError on GET /api/v1/films/1 when not logged in', function(done) {
        chai.request(index)
            .get('/api/v1/films/1')
            .end(function(err, res) {
                res.should.have.status(401);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('message').equal('No authorization token was found');
                res.body.should.have.property('name').equal('UnauthorizedError');
                done();
            });
    });

    it('returns an error on POST /api/v1/login with invalid credentials', function(done) {
        var user = {
            firstName: "invalid",
			lastName: "invalid",
			email: "invalid"
        }
        chai.request(index)
            .post('/api/v1/login')
            .send(user)
            .end(function(err, res) {
                res.should.have.status(401);
                res.should.be.json;
                res.body.should.be.an('object');
                res.body.should.have.property('error').that.is.a('string');
                res.body.error.should.equal('Invalid credentials')
                done();
            });
    });

    it('returns a token on POST /api/v1/login', function(done) {
        var user = {
            firstName: "test",
			lastName: "test",
			email: "test"
        }
        chai.request(index)
            .post('/api/v1/login')
            .send(user)
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.an('object');
                res.body.should.have.property('token').that.is.a('string');
                done();
            });
    });

});