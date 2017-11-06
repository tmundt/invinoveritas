/**
 * Created by thomasmundt on 05.01.16.
 */
var express = require('express');
var router = express.Router();
var passport = require('passport');


module.exports = function(app) {
    app.get('/',
        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/about'
        }));
    console.log('passport authentificate');
}
