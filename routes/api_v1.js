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

router.get("/login", function(req, res) {
	res.contentType("application/json");
	res.status(200).json({
		"test": "success"
	});
});

module.exports = router;