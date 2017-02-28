var express  = require('express') ;
var router = express.Router() ;
var passport = require('passport');
var User = require('../models/user') ;
router.use(function(req,res,next){
   res.locals.currentUser = req.user ;
   res.locals.errors = req.flash('error') ;
   res.locals.infos = req.flash('info') ;
   return next() ;
});
//root route
router.get('/',function (req,res) {
    res.json('welcome to my page!') ;
});
//register:get/post

router.get("/register", function(req, res) {
    res.render("register");
});
router.post('/register', function(req,res,next){
    var username = req.body.username;
    var password = req.body.password;
    //its customized, so for username, you could pass in email or any unique key
    User.findOne({username: username}, function(err, user){
        if(err){
            return next() ;
        } else{
            if(user){
                req.flash("error", "user already exists") ;
                res.redirect('back') ; //default its get request
            } else {
                //Creates a new instance of the User model with the username and password
                var newUser = new User({
                    username: username ,
                    password: password
                }) ;
                // Saves the new user to the database and continues to the next request handler
                newUser.save(next);
            }
        }
    });
    //Authenticates the user
}, passport.authenticate("login", {
    successRedirect:"/",
    successFlash: 'Welcome!',
    failureRedirect:"/register",
    failureFlash: true
}));


//login: get
router.get('/login', function(req,res){
    res.render('login.ejs') ;
}) ;

//Custom Callback
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

//or you could use the following one:
// router.post('/login', passport.authenticate("login", {
//     successRedirect:"/",
//     successFlash: 'Welcome!',
//     failureRedirect:"/register",
//     failureFlash: true
// })) ;

//logout
router.get('/logout', function (req,res) {
    req.logOut();
    req.flash("infos", "you are logged out!") ;
    res.redirect('/') ;
}) ;



module.exports= router ;