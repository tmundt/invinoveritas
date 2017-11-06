/**
 * Created by thomasmundt on 28.01.16.
 */
/**
 * Created by thomasmundt on 10.01.16.
 */
// Strategy and settings for authentication with Passport/Facebook
var FacebookStrategy = require('passport-facebook').Strategy;
//var User = require('../models/user');
//var fbConfig = require('../config/facebook.config.js');

//module.exports = function(passport) {
module.exports.setup = function(User, config,passport) {

    passport.use('facebook', new FacebookStrategy({
            clientID        : config.appID,
            clientSecret    : config.appSecret,
            callbackURL     : config.callbackUrl,
            profileFields: ['id', 'displayName', 'emails','name'],
            scope : 'email'
        },

        // facebook will send back the tokens and profile
        function(access_token, refresh_token, profile, done) {

            console.log('profile from FB: ', profile);

            // asynchronous
            process.nextTick(function() {

                // find the user in the database based on their facebook id
                User.findOne({ 'fb.id' : profile.id }, function(err, user) {

                    // if there is an error, stop everything and return that
                    // ie an error connecting to the database
                    if (err)
                        return done(err);

                    // if the user is found, then log them in
                    if (user) {
                        console.log('The user exists!');
                        return done(null, user); // user found, return that user
                    } else {
                        // if there is no user found with that facebook id, create them
                        console.log('passport.facebook.js: creating new user');
                        var newUser = new User();
                        if (profile.emails.length > 0) {
                            console.log('profile.emails length: ' + profile.emails.length);
                            console.log("profile.emails[0].value: " + profile.emails[0].value);
                        }
                        // set all of the facebook information in our user model
                        newUser.fb.id    = profile.id; // set the users facebook id
                        newUser.fb.access_token = access_token; // we will save the token that facebook provides to the user
                        newUser.fb.firstName  = profile.name.givenName;
                        newUser.fb.lastName = profile.name.familyName; // look at the passport user profile to see how names are returned
                        newUser.fb.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

                        console.log('newUser: ');
                        console.log(newUser);
                        // save our user to the database
                        newUser.save(function(err) {
                            if (err)
                                throw err;

                            // if successful, return the new user
                            return done(null, newUser);
                        });
                    }

                });
            });

        }));

};

