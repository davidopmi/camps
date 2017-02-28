var express = require('express');
var path = require('path') ;

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser') ;
var session = require('express-session') ;
var MongoStore = require('connect-mongo/es5')(session);
var passport = require('passport') ;
var flash = require('connect-flash') ;
var morgan = require('morgan');
var mongoose = require('mongoose') ;
var methodOverride = require('method-override') ;

var dogsRoutes= require('./routes/dogs') ;
var indexRoutes = require('./routes/index') ;
var apiRoutes = require('./apis/index') ;
var setUpPassport = require('./config/setUpPassport') ;
var app = express() ;

//====connect to DB ===
mongoose.connect("mongodb://localhost/mid_auth",function(err){
    if(err){
        console.log(err) ;
    } else{
        console.log("database is connected!") ;
    }
}) ;

//======settings =====
app.set('view engine', 'ejs') ;
app.set("views", path.join(__dirname, "views"));
//set the port, note in app.listen will use the app.get
app.set('port', process.env.IP ||3000) ;
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public'))) ;
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser()) ;
app.use(flash()) ;
app.use(methodOverride('_method')) ;
/*
*   ■ secret allows each session to be encrypted from the clients. This deters hackers from hacking into dogs’ cookies. As noted, it needs to be a bunch of random characters.
    ■ resave is option required by the middleware. When it’s set to true, the session will be updated even when it hasn’t been modified.
    ■ saveUninitialized is another required option. This resets sessions that are uninitialized.
*
*
* */
app.use(session({secret:"my secrete",
    resave:true,
    saveUninitialized:true, store: new MongoStore({
        mongooseConnection: mongoose.connection,
        ttl: 14*24*60*60  // 14 days. default
    })})) ;
//Initializes the Passport module
app.use(passport.initialize());
//Handles Passport sessions
app.use(passport.session());

//for routes
app.use('/', indexRoutes) ;
app.use('/dogs',dogsRoutes) ;
app.use('/apis', apiRoutes) ;

setUpPassport() ;

/*==== to demo saved user._id in session(sessionID) matches currently login user's id
so when user login, server could use this ID, go to the Database, find out the whole user and put it in the req.user object!
==========THIS IS HOW SESSION WORK!===========
passport.serializeUser(function (user,done) {
    done(null, user._id) ;
});
*/
app.use(function(req,res,next){
    console.log(req.session) ; //passport:user:xxxx
    console.log("=============") ;
    console.log(req.user) ;
    next();
}) ;

app.listen(app.get('port'), function(){
    console.log("server is up on port:" + app.get("port")) ;
});