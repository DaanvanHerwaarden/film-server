var express = require('express');
var router = express.Router();

router.get("/login", function(req, res) {
	res.contentType('application/json');
	res.status(200).json({
		"test": "success"
	});
});

module.exports = router;