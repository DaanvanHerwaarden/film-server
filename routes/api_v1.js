var auth = require("../auth/authentication.js");
var express = require("express");
var router = express.Router();
var database = require("../database.js");

router.get("/films", function (req, res) {
	res.contentType("application/json");
	
	var offset = parseInt(req.query.offset);
	var count = parseInt(req.query.count);
	
	database.query("SELECT * FROM `film` LIMIT ? OFFSET ?", [ count, offset ], function(error, rows, fields) {
		if (error) {
			res.status(400).json(error);
			console.log(error);
		} else {
			res.status(200).json(rows);
		}
	});
});

router.post('/register', function (request, response) {

    var customer = request.body;

    var query = {
        sql: 'INSERT INTO `customer` (first_name, last_name, email) VALUES (?, ?, ?)',
        values: [ customer.first_name, customer.last_name, customer.email],
        timeout: 2000 //2secs
    };

    response.contentType('application/json');
    database.query(query, function(error, rows, fields) {
        if (error) {
            response.status(400);
            response.json(error);
        } else {
            response.status(200);
            response.json(rows);
        };
    });
})

router.get("/films/:filmid", function(req, res) {
	res.contentType("application/json");

    var filmId = req.params.filmid;

    database.query("SELECT * FROM `film` WHERE film_id = ?", [ filmId ], function(error, rows, fields) {
        if (error) {
            res.status(400).json(error);
        } else {
            res.status(200).json(rows);
        }
    });
});

router.delete("/rentals/:userid/:inventoryid", req, res){

    
}

router.post("/login", function(req, res){
    var username = req.body.username;
    var password = req.body.password;
	
	res.contentType("application/json");

    if(username == "username" && password == "test") {
        var token = auth.encodeToken(username);
        res.status(200);
        res.json({
			token: token
		});
    } else {
        res.status(401);
        res.json({
            error: "ongeldige usernaam of password."
        });
    }
});

router.get("/hello", function(req, res){
    res.contentType("application/json");
    res.status(200);
    res.json(mijnObject);
});

module.exports = router;