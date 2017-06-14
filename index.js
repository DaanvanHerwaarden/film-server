var bodyParser = require("body-parser");
var config = require("./config/config.json");
var express = require("express");
var routes = require('./routes/api_v1.js');

var app = express();

//Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json'}));

//Gebruik de routers
app.use('/api/v1', routes);

//Fallback - als geen enkele andere route slaagt wordt deze uitgevoerd. 
app.use('*', function(req, res) {
    res.status(400);
    res.json({
        "error": "Deze URL is niet beschikbaar."
    });
});

app.listen(3000, function() {
    console.log("Server luistert op port " + config.port);
});