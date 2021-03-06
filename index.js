var bodyParser = require("body-parser");
var config = require("./config/config.json");
var express = require("express");
var routes = require('./routes/api_v1.js');
var expressJWT = require("express-jwt");

var app = express();

//Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json'}));

// Beveilig alle URL routes, tenzij het om /login of /register gaat.
app.use(expressJWT({
    secret: config.secretkey
}).unless({
    path: [
        { url: "/api/v1/login", methods: ["POST"] },
        { url: "/api/v1/register", methods: ["POST"] }
    ]
}));

// Errorhandler voor express-jwt errors
// Wordt uitgevoerd wanneer err != null; anders door naar next().
app.use(function(err, req, res, next) {
    var error = {
        message: err.message,
        code: err.code,
        name: err.name,
        status: err.status
    }
    res.status(401).send(error);
});

app.use("*", function(req, res, next) {
	console.log("Request opgevangen");
	next();
});

//Gebruik de routers
app.use('/api/v1', routes);

//Fallback - als geen enkele andere route slaagt wordt deze uitgevoerd. 
app.use('*', function(req, res) {
    res.status(400);
    res.json({
        "error": "Deze URL is niet beschikbaar."
    });
});

app.listen(process.env.PORT || 3000, function() {
    console.log("Server luistert op port " + config.port);
});

module.exports = app;