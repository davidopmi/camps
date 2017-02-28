var passport = require('passport') ;
var LocalStrategy = require('passport-local').Strategy ;
var User = require('../models/user') ;

module.exports = function(){
    //serializeUser should turn a user object into an ID. You call done with no error and the user’s ID.
    passport.serializeUser(function (user,done) {
        done(null, user._id) ;
    });
    //deserializeUser should turn the ID into a user object. Once you’ve finished, you call done with any errors and the user object.
    passport.deserializeUser(function(id, done){
        User.findById(id, function (err, user) {
            done(err, user);
        })
    }) ;
    /* Strategy:
    * 1 Look for a user with the supplied username.
    *
     2 If no user exists, then your user isn’t authenticated; say that you’ve finished with
     the message “No user has that username!”

     3 If the user does exist, compare their real password with the password you supply.
     If the password matches, return the current user with no err. If it doesn’t, return “Invalid password.”
     4: you could change the usernameField value to 'email' so that it will check based on username. === customized.
    * */
    passport.use("login", new LocalStrategy({
        usernameField: 'username',
        passwordFiled: 'password',
        passReqToCallback: true
    },
        function (req, username, password, done) {
            //if email then change to email
            User.findOne({username: username}, function(err, user){
                if (err){
                    return done(err) ;
                } else{
                    if(!user){
                        return done(null, false, {message: "No user has that username!"}) ;
                    } else{
                        user.checkPassword(password, function(err, isMatch){
                            if(err){
                                return done(err) ;
                            } else{
                                if(isMatch){
                                    return done(null, user);
                                } else{
                                    return done(null, false, {message:"invalid password."}) ;
                                }
                            }
                        })
                    }
                }
            })
        }
    ))

} ;