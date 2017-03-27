/**
 * Created by GMI-PC on 24/03/2017.
 */
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var passport	= require('passport');
var config      = require('./config/database'); // get db config file
var port        = process.env.PORT || 3000;
var jwt         = require('jwt-simple');

// get our request parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// log to console
app.use(morgan('dev'));

// Use the passport package in our application
app.use(passport.initialize());

//Use Control access
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "POST, GET");
    res.header("Access-Control-Max-Age", "3600");
    next();
});

// demo Route (GET http://localhost:8080)
app.get('/', function(req, res) {
    res.send('Hello! The API is at http://localhost:' + port + '/api');
});

mongoose.connect(config.database);

require('./config/passport')(passport);

// Api Middlewares
var apiVoyageur = require('./app/routes/voyageur-route');
// connect the api routes under /api/*
app.use('/api', apiVoyageur);

var apiAdmin = require('./app/routes/admin-route');
// connect the api routes under /api/*
app.use('/admin', apiAdmin);


// Start the server
app.listen(port);
console.log('There will be dragons: http://localhost:' + port);