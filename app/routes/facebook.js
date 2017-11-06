
/**
 * Created by thomasmundt on 12.01.16.
 */
'use strict';

var express = require('express');
var passport = require('passport');

var router = express.Router();

router
    .get('/', passport.authenticate('facebook', {
        scope: ['email'],
        successRedirect: '/',
        failureRedirect: '/error'
    }))

    .get('/callback', passport.authenticate('facebook', {
        failureRedirect: '/'
    }))

module.exports = router;
