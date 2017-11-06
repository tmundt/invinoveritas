/**
 * Created by thomasmundt on 28.01.16.
 */

var express = require('express');
var passport = require('passport');
var router = express.Router();
var User = require('../../models/user');


passport.serializeUser(function(user, done) {
    console.log('serializing user: ');
    console.log(user);
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        console.log('deserializing user:',user);
        done(err, user);
    });
});
console.log('auth/facebook/index...');
router
    .get('/', passport.authenticate('facebook', {
        scope: ['email', 'user_about_me'],
        failureRedirect: '/signup',
        session: true
    }));
router
    .get('/callback', passport.authenticate('facebook', {
        successRedirect : '/',
        failureRedirect: '/signup',
        session: true
    }));
module.exports = router;
