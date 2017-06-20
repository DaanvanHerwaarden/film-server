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

router.get("/films/rentals/:filmid", function (req, res) {
	res.contentType("application/json");
	
	var filmId = req.params.filmid; //film id
	
	database.query("SELECT * FROM `rental` WHERE film_id = ?", [ filmid ], function(error, rows, fields) {
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

    database.query("SELECT * FROM `view_rental` WHERE film_id = ?", [ filmId ], function(error, rows, fields) {
        if (error) {
            res.status(400).json(error);
        } else {
            res.status(200).json(rows);
        }
    });
});

router.post("/login", function(req, res){
    var username = req.body.username;
    var password = req.body.password;
	
	res.contentType("application/json");

	database.query("SELECT COUNT(*) AS COUNT FROM `customer` WHERE (first_name = ? AND last_name = ?);", [ username, password ], function(error, rows, fields) {
	    if (rows[0].COUNT  > 0) {
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
});

router.get("/rentals/:userid", function(req, res) {
	res.contentType("application/json");
	
	var customerId = req.params.userid;
	
	database.query("SELECT * FROM `rental` WHERE customer_id = ?", [ customerId ], function(error, rows, fields) {
		if (error) {
            res.status(400).json(error);
        } else {
            res.status(200).json(rows);
        }
	});
});

router.post("/rentals/:userid/:inventoryid", function(req, res) {
	res.contentType("application/json");
	
	var customerId = req.params.userid;
	var inventoryId = req.params.inventoryid;
	var staffId = 1;
	
	database.query("INSERT INTO `rental`(rental_date, inventory_id, customer_id, staff_id) VALUES(NOW(), ?, ?, ?)", [ inventoryId, customerId, staffId ], function(error, rows, fields) {
        if (error) {
            res.status(400).json(error);
        } else {
            res.status(200).json(rows);
        }
    });
});

router.put("/rentals/:userid/:inventoryid", function(req, res) {
   res.contentType("application/json");

   var customerId = req.params.userid;
   var inventoryId = req.params.inventoryid;

   database.query("UPDATE `rental` SET inventory_id = ? WHERE customer_id = ?", [ inventoryId, customerId ], function(error, rows, fields) {
       if (error) {
           res.status(400).json(error);
       } else {
           res.status(200).json(rows);
       }
   });
});

router.delete("/rentals/:userid/:inventoryid", function(req, res) {
    res.contentType("application/json");

    var customerId = req.params.userid;
    var inventoryId = req.params.inventoryid;

    database.query("DELETE FROM `rental` WHERE (customer_id = ? AND inventory_id = ?)", [ customerId, inventoryId ], function(error, rows, fields) {
        if (error) {
            res.status(400).json(error);
        } else {
            res.status(200).json(rows);
        }
    });
});

module.exports = router;