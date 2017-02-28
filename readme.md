this example is to show you how to use bcrypt-nodejs to hash your password
1: get the morgan(dev) and nodemon
 npm install -g nodemon
 nodemon app.js

2: models/user.js  package: bcrypt-nodejs
    a: bcrypt.genSalt: generate the salt
    b: bcrypt.hash: hash password
    c: bcrypt.compare: checkPassword
    
3: app.js: body-parser cookie-parser express-session connect-flash
    
part 1: for register in routes/index.js: passport
    a) call findOne to check if user same name already existed
    b) create and save user
    c) use passport.authenticate() to login new user
note, you could create the apis to the logic

part 2: for authentication: authentication only happens for login: passport-local passport 
    a) in app.js set up the passport. you’ll need to do three things
     1) Set up the Passport middleware. This is pretty easy:
         ■ body-parser—parses HTML forms
         ■ cookie-parser—handles the parsing of cookies from browsers and is required for user sessions
         ■ express-session—Stores user sessions across different browsers
         ■ connect-flash—Shows error messages 
         ■ passport.initialize—Initializes the Passport module
         ■ passport.session—Handles Passport sessions 
             
 =====create config/setUpPassport.js for 2) and 3) ===============
 http://passportjs.org/docs/configure
 2) Tell Passport how to serialize and deserialize users. This is a short amount of code
 that effectively translates a user’s session into an actual user object.
    "In a typical web application, the credentials used to authenticate a user will only be transmitted during the login request. 
    If authentication succeeds, a session will be established and maintained via a cookie set in the user’s browser.
     Each subsequent request will not contain credentials, but rather the unique cookie that identifies the session. 
     In order to support login sessions, Passport will serialize and deserialize user instances to and from the session."
 
 3) Set up the strategy: Tell Passport how to authenticate users. In this case, this is the bulk of your code,
 which will instruct Passport how to talk to your Mongo database.
     1) Look for a user with the supplied username.
     2) If no user exists, then your user isn’t authenticated; say that you’ve finished with
     the message “No user has that username!”
     3) If the user does exist, compare their real password with the password you sup-
     ply. If the password matches, return the current user. If it doesn’t, return “Invalid password.”
     
     NOTE: in the setUpPassport.js you specify the passport.use("name"), then in index.js, whenever you use passport.authenticate, 
     have to make sure the name matches!!!

    part 3: persistent session storage: currently, the session is stored in server's ram memory.
    We want to save the session in our database, this way, when we restart the server, user's session will be still in our database.
    
    1) npm install --save connect-mongo
    https://github.com/jdesboeufs/connect-mongo
    
    2) in app.js:
    var MongoStore = require('connect-mongo/es5')(session);
    and then make changes to session config:  add the store property
    app.use(session({secret:"my secrete",
        resave:true,
        saveUninitialized:true,
        store: new MongoStore({
            mongooseConnection: mongoose.connection
        })})) ;
        
    3) test it: restart server and client user refresh, still in the app(previously will be kicked to login screen).
    4) check you database, there will be a sessions collection note, be default, session will be stored in database for 2 weeks. you can change it:
    5) ttl: 14*24*60*60  // 14 days. default
    restart you server and refresh the page, you should see the session expires will be updated to 2 days.
    6) create a middleware in app.js to demo how the passport.serializeUser works:
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

## passport.authenticate()  two ways of using it:
//1: Custom Callback
router.post('/login', function(req, res, next) {
    passport.authenticate('login', function(err, user, info) {
        if (err) { return next(err); }
        if (!user) { return res.redirect('/login'); }
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.redirect('/dogs');
        });
    })(req, res, next);
});

//2: or you could use the following one:
router.post('/login', passport.authenticate("login", {
     successRedirect:"/",
     successFlash: 'Welcome!',
     failureRedirect:"/register",
     failureFlash: true
})) ;
