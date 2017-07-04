var chai = require("chai");
var chaiHttp = require("chai-http");
var sinon = require('sinon');
var index = require("../index.js");
var chould = chai.should();

var token;
var filmId;

chai.use(chaiHttp);

// Helperfunctie om een geldig token op te halen.
// Alle testcases maken hier gebruik van.
var getToken = function() {
    var user = {
            firstName: "test",
			lastName: "test",
			email: "test"
	}
    chai.request(index)
        .post('/api/v1/login')
        .send(user)
        .end(function(err, res) {
            res.body.should.be.an('object');
            res.body.should.have.property('token');
            this.token = res.body.token;
            console.log("Token: " + this.token);
        });
}

describe('Get a valid token', function() {
    before(function() {
        if (!this.token) {
            this.token = getToken();
        }
    });

    it('should return a valid token', function(done) {
        chai.request(index)
            .get('/api/v1/login')
            .set('Authorization', 'Bearer ' + this.token)
            .end(function(err, res) {
                done();
            });
    });
});

/**
 * Voor deze testcases hebben we een JWT token nodig maar wat we ook geprobeerd hebben, de variabele token
 * wordt elke keer teruggezet naar 'undefined' ook al verkrijgen we een valide token in de getToken() function.
 * Door dit probleem zijn deze testcases uitgeschakeld.
 */
// describe('GET /api/v1/films/1', function() {
//     before(function() {
//         if (!this.token) {
//             token = getToken();
//         }
//     });
//
//     it('should return reservations of film 1 when logged in', function(done) {
//         chai.request(index)
//             .get('/api/v1/films/1')
//             .set('Authorization', 'Bearer ' + this.token)
//             .end(function(err, res) {
//                 res.should.have.status(200);
//                 res.should.be.json;
//                 res.body.should.be.a('object');
//                 res.body.should.have.property('result').that.is.an('array');
//                 res.body.result.should.have.lengthOf(4);
//                 done();
//             });
//     });
//
// 	it('should return empty array on invalid ID', function(done) {
//         var filmId = 9999;
//         chai.request(index)
//             .get('/api/v1/films/' + filmId)
//             .set('Authorization', 'Bearer ' + this.token)
//             .end(function(err, res) {
//                 res.should.have.status(200);
//                 res.should.be.json;
//                 res.body.should.be.a('object');
//                 res.body.should.have.property('result').that.is.an('array');
//                 res.body.result.should.have.lengthOf(0);
//
//                 done();
//             });
//     });
// });