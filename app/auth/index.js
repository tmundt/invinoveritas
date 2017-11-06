/**
 * Created by thomasmundt on 10.01.16.
 */
// init passport authentication
var facebook = require('./passport.facebook');
//var twitter = require('./twitter');
var User = require('../models/user');
var config = require('../config').fb;
var passport = require('passport');
var router = require('express').Router();


// Passport Configuration
require('./facebook/passport').setup(User, config, passport);

//router.use('/local', require('./local'));
router.use('/facebook', require('./facebook'));
//router.use('/google', require('./google'));


//module.exports = function(passport){
//    console.log('init passport...');
//
//    // Passport needs to be able to serialize and deserialize users to support persistent login sessions
//    passport.serializeUser(function(user, done) {
//        console.log('serializing user: ');
//        console.log(user);
//        done(null, user._id);
//    });
//
//    passport.deserializeUser(function(id, done) {
//        User.findById(id, function(err, user) {
//            console.log('deserializing user:',user);
//            done(err, user);
//        });
//    });
//
//    // Setting up Passport Strategies for Facebook
//    facebook(passport);
//    //twitter(passport);
//
//}
module.exports = router;

