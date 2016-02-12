// set up ======================================================================

//var express  = require('express');
var express  = require('express.io');
var app      = express(); 								// create our app w/ express
var mongoose = require('mongoose'); 					// mongoose for mongodb
var port  	 = process.env.PORT || 8080; 				// set the port
var database = require('./config/database'); 			// load the database config
var cors = require("cors");
var morgan = require('morgan'); 		// log requests to the console (express4)
var bodyParser = require('body-parser'); 	// pull information from HTML POST (express4)
var multer = require('multer');
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
var favicon = require('serve-favicon');
var passport = require('passport');

//var fs       = require('fs')
var  fs       = require('fs-extra') /* all the methods of fs are present in this */
    , http     = require('http')
    , util     = require('util')
    , path     = require('path');


app.set('port', port);

// configuration ===============================================================
mongoose.connect(database.url); 	// connect to mongoDB database on modulus.io


app.http().io()

app.io.route('ready', function(req) {

    // Added to create the Notification news feed
    var mubsub = require('mubsub');
    var client = mubsub(database.url);
    //var channel = client.channel('notifications', { size: 100000, max: 500, retryInterval:200  });
    var channel = client.channel('notifications');

    client.on('error', console.error);
    channel.on('error', console.error);

    var callback = function(message){
        //console.log("Callback")
        //console.log(message)
        req.io.emit('notification', {
            message: message
        })
    }

    channel.subscribe('document', callback);

})

app.use(express.static(__dirname + '/public')); 				// set the static files location /public/img will be /img for users
app.use(morgan('dev')); 										// log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'})); 			// parse application/x-www-form-urlencoded
//app.use(multer());

/*Configure the multer.*/
app.use(multer({ dest: './public/uploads/',
    rename: function (fieldname, filename) {
        return filename+Date.now();
    },
    onFileUploadStart: function (file) {
//        console.log(file.originalname + ' upload is starting ...')
    },
    onFileUploadComplete: function (file) {
//        console.log(file.fieldname + ' uploaded to  ' + file.path)
    }
}));


app.use(bodyParser.json()); 									// parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json

app.use(methodOverride());
//app.use(bodyParser({keepExtensions: true, uploadDir:__dirname + '/public/uploads' }));
app.use(bodyParser({keepExtensions: true, uploadDir: './uploads' }));
app.use(cors());

app.use(cookieParser('secret'));
app.use(session({cookie: { maxAge: 60000 }}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
//app.use(favicon(__dirname+'/public/favicon.ico'));
app.use(favicon(path.join(__dirname,'public','favicon.ico')));

// routes ======================================================================
require('./app/emailroute.js')(app,passport);
require('./app/routes.js')(app, passport);
require('./config/passport.js')(app, passport);

// listen (start app with node server.js) ======================================
app.listen(port);
console.log("App listening on port " + port);