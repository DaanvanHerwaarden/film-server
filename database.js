var mysql = require("mysql");
var config = require("./config/config.json");

var connection = mysql.createConnection({
	host		: config.address,
	user		: config.user,
	password	: config.password,
	database	: config.database
});

connection.connect(function(error) {
	if (error) {
		console.log(error);
		return;
	} else {
		console.log("Connected to " + config.database);
	}
});

module.exports = connection;