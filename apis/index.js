var express  = require('express') ;
var router = express.Router() ;
var passport = require('passport');
var User = require('../models/user') ;

//this is to test the user register function
router.post('/dogs/register', function(req,res,next){
    var username = req.body.username;
    var password = req.body.password;
    //its customized, so for username, you could pass in email or any unique key
    User.findOne({username: username}, function(err, user){
        if(err){
            return next() ;
        } else{
            if(user){
                req.flash("error", "user already exists") ;
                res.json(req.flash('error')) ;
            } else {
                //Creates a new instance of the User model with the username and password
                var newUser = new User({
                    username: username ,
                    password: password
                }) ;
                // Saves the new user to the database and continues to the next request handler
                newUser.save(function (err, savedUser) {
                    if(err){
                        res.json(err.message) ;
                    } else{
                        res.json(savedUser) ;
                    }
                });
            }
        }
    });
    //Authenticates the user
});

module.exports= router ;