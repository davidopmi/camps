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
var methodOverride = require("method-override") ; 

//=== bring in routes === 
var commentRoutes = require("./routes/comments.js") ; 
var campRoutes = require("./routes/camps.js") ; 
var indexRoutes = require("./routes/index.js") ; 

//====settings: view engine, views, public folder, body-parser 
app.set('view engine', 'ejs') ; 
app.set('views', path.join(__dirname, 'views')) ; 
app.use(express.static(path.join(__dirname,'public'))) ; 
app.use(bodyParser.urlencoded({extended:true})) ; 
// override with POST having ?_method=DELETE 
app.use(methodOverride('_method')) ; 

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
//do this after the res.locals.campUser
app.use('/camps/:id/comments',commentRoutes) ; 
app.use('/camps',campRoutes) ; 
app.use('/' , indexRoutes) ;


mongoose.connect("mongodb://localhost/camps_v11");
//call the seedsDB!!
// seedsDB() ; 

//2: routes 




//3: bring up your server 
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("camps server is up!!!") ; 
}); 