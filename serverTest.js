var express  = require('express');
var app = express();

var mongoose = require('mongoose');
var port  	 = process.env.PORT || 8080;
var database = require('./config/database'); 			// load the database config

var passport = require('passport');

mongoose.connect(database.url); 	// connect to mongoDB database on modulus.io

require("./config/express.js")(express,app,passport);
require('./app/controllers/controller.js')(app,passport);
require('./config/passport.js')(app, passport);

app.listen(port);
console.log("App listening on port " + port);


