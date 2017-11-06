
var express = require('express'),
    app = express(),
    path = require('path'),
    bodyParser = require('body-parser'),
    favicon = require('serve-favicon'),
    cookieParser = require('cookie-parser'),
    mongoose = require('mongoose'),
    logger = require('morgan');
    port = process.env.PORT || 9000;

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
// config files
//var dbConfigLocal = require('./app/config').dbLocal;
var dbConfigMongoLab = require('./app/config').dbMongolab;

// log every event
app.use(logger("dev"));

app.use(favicon(__dirname + '/public/favicon.ico'));

// Connection to local database
//mongoose.connect(dbConfigLocal.url);
// Connection to remote MongoLab database
mongoose.connect(dbConfigMongoLab.url);
// Handle if no database connection established
mongoose.connection.on('error', function(err) {
    console.error('MongoDB connection error: ' + err);
    process.exit(-1);
});

// parse application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

// configure public assets folder
app.use(express.static(__dirname + '/public'));

// Configure Passport
var passport = require('passport');
app.use(session({
    secret: 'mySecretKey',
    resave: false,
    saveUninitialized: false,
    store : new MongoStore({
        //url: dbConfigLocal.url
        url: dbConfigMongoLab.url
    })
}));

// Using the flash middleware provided by connect-flash to store messages in session
// and displaying in templates
var flash = require('connect-flash');
app.use(flash());

// Routes
require('./app/routes')(app, passport);
// start the server
app.listen(port);
console.log('Magic happens on http://localhost:' + port);

// expose app
exports = module.exports = app;
