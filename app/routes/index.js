//Routes - index.js/Main routes

var express = require('express');
var router = express.Router();
//var passport = require('passport');

//router.use('/', require('./facebook'));
//router.use('/facebook', require('./facebook'));
module.exports = function(app,passport) {

    app.use('/api/wine', require('../api/wine'));
    app.use('/api/importio', require('../api/importio'));
    app.use('/api/depot', require('../api/depot'));

    // Passport
    app.use(passport.initialize());
    app.use(passport.session());

    app.use('/auth', require('../auth'));
    app.get('/error', function(req, res) {
        res.send("FEHLER, user: " + req.user);
    });

    // Handler to get current user out of session
    app.get('/currentuser', function(req, res) {
        //var data = {};
        //data.user = req.user;
        //return data;
        //res.send(req.user);
        console.log(req.user);
        res.json(req.user || null);
    });

    // Handler to log out user
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    /* GET home page. */
    app.get('/', function(req, res, next) {
        res.render('../index', { user : req.user });
        next();
    });
}

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        console.log('user.isAuthentificated!');
        return next();
    }


    // if they aren't redirect them to the home page
    console.log('SERVER: isLoggedIn(): no user found');
    res.redirect('/');
}
