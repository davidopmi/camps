var express = require("express") ;
var app = express() ; 
var path = require("path") ; 
var bodyParser = require("body-parser") ; 
var mongoose = require("mongoose") ; 
var User = require("./models/user.js") ; 
// var Comment = require("./models/comment.js") ; 
// var seedsDB = require("./seeds.js") ; 
var passport = require("passport") ; 
var LocalStrategy = require("passport-local") ; 
var passportLocalMongoose = require("passport-local-mongoose") ; 
var session                 = require('express-session') ; 

//====settings: view engine, views, public folder, body-parser 
app.set('view engine', 'ejs') ; 
app.set('views', path.join(__dirname, 'views')) ; 
app.use(express.static(path.join(__dirname,'public'))) ; 
app.use(bodyParser.urlencoded({extended:true})) ; 

//=======1: tell the app to use passport for auth.
app.use(session({secret:"anything u want", resave:false, saveUninitialized: false }))
app.use(passport.initialize()) ; 
app.use(passport.session()) ; 

//=======2: tell the passport whats the strategy 
// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



mongoose.connect("mongodb://localhost/auth_demo");

// routes 
app.get('/', function(req,res){
    res.render('index.ejs') ; 
}) ; 
app.get('/secret',isLoggedIn,function(req,res){
    console.log("in /secret callback");
    res.render('secret.ejs') ; 
})

//==signup! get: show the form  
app.get('/register' , function(req, res) {
    res.render('register.ejs');
}) ; 
app.post('/register', function(req,res){
    User.register(new User({username: req.body.username}), 
    req.body.password, function(err, newUser){
        if (err) {
            console.log(err) ; 
            res.redirect('/login') ; 
        } else{
            passport.authenticate("local")(req,res,function(){
                res.redirect('/secret') ; 
            }) ; 
        }
    }) ; 
} )

//===login section
//show the form!
app.get('/login', function(req, res) {
    res.render('login.ejs') ; 
}) ; 
app.post('/login', passport.authenticate("local", {
    successRedirect:"/secret",
    failureRedirect:"/login"
}), function(req,res){}) ;

//=== logout
app.get('/logout', function(req, res) {
    //destroy user's info in session 
    req.logOut() ; 
    //normally we redirect to the homepage 
    res.redirect('/') ; 
}) ; 

function isLoggedIn(req,res,next){
     console.log("in isLoggedIn callback");
    //call req.isAuthenticated() to check if the current user is logged in
    if (req.isAuthenticated()) {
        //if logged in, then proceed....
        return next() ; 
    } else{
        //if not logged in, then go back to login page!!!
        res.redirect('/login') ; 
    }
}
//start up server
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("auth_demo server is up!") ; 
});