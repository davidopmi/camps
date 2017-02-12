var express = require("express") ; 
var router = express.Router() ; 
var User = require("../models/user.js") ; 
var passport = require("passport") ;

router.get('/', function(req,res){
    res.render('landing.ejs') ; 
}) ; 

//====1: register
//get
router.get('/register', function(req, res) {
    res.render('register.ejs') ; 
}); 
//post
router.post('/register', function(req, res) {
    //put the new user into database 
    User.register(new User({username: req.body.username}),
    req.body.password , 
    function(err,newUser){
        if (err) {
            console.log(err) ; 
            return res.redirect('/register') ;  
        } else{
            passport.authenticate("local")(req,res,function(){
                res.redirect('/camps') ; 
            }) }
    })
}) ; 

//====2: login 
router.get('/login', function(req, res) {
    res.render('login.ejs') ; 
}); 
router.post('/login', passport.authenticate("local",{
    successRedirect:"/camps",
    failureRedirect:"/login"
}) , function(req,res){}) ; 
//===3: logout
router.get('/logout', function(req, res) {
    req.logOut() ; 
    //redirect to home page 
    res.redirect('/') ; 
}); 

//===4: middleware: server as a lock 
function isLoggedIn(req,res,next){
    if (req.isAuthenticated()) {
        return next() ; 
    } else{
        res.redirect('/login') ; 
    }
}
module.exports = router ; 