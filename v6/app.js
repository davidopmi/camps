//3 steps 
var express = require("express") ;
var app = express() ; 
var path = require("path") ; 
var bodyParser = require("body-parser") ; 
var mongoose = require("mongoose") ; 
var Camp = require("./models/camp.js") ; 
var Comment = require("./models/comment.js") ; 
var User = require("./models/user.js") ; 
var seedsDB = require("./seeds.js") ; 
var session  = require("express-session") ; 
var passport = require("passport") ; 
var LocalStrategy = require("passport-local") ; 
var passportLocalMongoose = require("passport-local-mongoose") ; 


//====settings: view engine, views, public folder, body-parser 
app.set('view engine', 'ejs') ; 
app.set('views', path.join(__dirname, 'views')) ; 
app.use(express.static(path.join(__dirname,'public'))) ; 
app.use(bodyParser.urlencoded({extended:true})) ; 

//====1: tell app to use passport 
app.use(session({secret:"anything u want", resave:false, saveUninitialized: false }))
app.use(passport.initialize()) ; 
app.use(passport.session()) ; 


//====2: tell passport how to do the job 
// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware
app.use(function(req,res,next){
    res.locals.campUser = req.user ; 
    next() ; 
}); 

mongoose.connect("mongodb://localhost/camps_v6");
//call the seedsDB!!
seedsDB() ; 

//2: routes 
app.get('/', function(req,res){
    res.render('landing.ejs') ; 
}) ; 
app.get('/camps', function(req,res){
    console.log(req.user) ; 
    
    Camp.find({ } , function(err, foundCamp){
        if (err) {
            console.log("error happend!") ; 
        } else{
            res.render('camps/index.ejs',{camps: foundCamp}) ; 
        }
    }) ; 
}) ; 

app.get('/camps/new', function(req,res){
    res.render('camps/new.ejs') ; 
}) ; 


//SHOW route
app.get('/camps/:id',function(req, res) {
    //get the id
    var id = req.params.id ; 
    //use this id to get all info from database 
    Camp.findById(id).populate("comments").exec(function(err, foundCamp){
        if (err) {
            console.log(err) ; 
        } else{
            console.log(foundCamp) ; 
            res.render("camps/show.ejs", {camp: foundCamp}) ; 
        }
    })
}); 

//this is the place when use submit the form 
app.post('/camps',function(req, res){
    //1: get the user data
    var campName = req.body.name ;
    var campImage = req.body.image ; 
    var newCamp = {name: campName, image: campImage} ; 
    //add the newCamp to our database 
    Camp.create(newCamp,function(err,newCamp){
        if(err){
        console.log(err) ; 
    } else{
      //3: re-render the /camps 
    res.redirect('/camps') ; 
    }
    }); 
}); 


//========= for comment ===============
//new for comment
app.get('/camps/:id/comments/new' , isLoggedIn ,  function(req, res) {
    //have to pick up a specific camp user clicked!!!
    var id = req.params.id ; 
    Camp.findById(id, function(err, foundCamp){
        if (err) {
            console.log(err) ; 
        } else{
            //show a new form for comment
            res.render('comments/new.ejs',{camp : foundCamp}) ; 
        }
    }) ; 
}); 
//create for comment 
app.post('/camps/:id/comments',isLoggedIn, function(req,res){
    //get the data
    console.log(req.body.comment) ; 
    //find the camp
    var id = req.params.id ;
    Camp.findById(id, function(err, foundCamp) {
        //create a comment 
        Comment.create(req.body.comment, function(err, newComment){
            if (err) {
                console.log(err) ; 
            } else{
                //update camp comment 
                foundCamp.comments.push(newComment) ;
                        //save the camp 
                foundCamp.save() ; 
                //redirect to camps/:id
                res.redirect('/camps/'+ foundCamp._id) ; 
            }
        }); 
    }) ; 
}) ; 

//====1: register
//get
app.get('/register', function(req, res) {
    res.render('register.ejs') ; 
}); 
//post
app.post('/register', function(req, res) {
    //put the new user into database 
    User.register(new User({username: req.body.username}),
    req.body.password , 
    function(err,newUser){
        if (err) {
            console.log(err) ; 
            res.redirect('/login') ; 
        } else{
            passport.authenticate("local")(req,res,function(){
                res.redirect('/camps') ; 
            }) }
    })
}) ; 

//====2: login 
app.get('/login', function(req, res) {
    res.render('login.ejs') ; 
}); 
app.post('/login', passport.authenticate("local",{
    successRedirect:"/camps",
    failureRedirect:"/login"
}) , function(req,res){}) ; 
//===3: logout
app.get('/logout', function(req, res) {
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
//============end of comment============

//3: bring up your server 
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("camps server is up!!!") ; 
}); 