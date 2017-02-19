#Camp v14 Flash Messages
NOTE: make sure you change database connection to v14
mongoose.connect("mongodb://localhost/camp_v14") ;


## Adding in connect-flash package
* Install and configure connect-flash
https://gist.github.com/raddeus/11061808
npm install --save connect-flash 
in app.js: 
var flash = require("connect-flash") ; 
app.use(flash());

* to set and get flash msg:
set the flash message: in middleware/index.js: 
note: have to do it before redirect, so the flash message will display on the next page(login)
// Set a flash message by passing the key, followed by the value, to req.flash(). 
req.flash("error", "Please login First"); 
res.redirect('/login') ; 
then get the flash message: in routes/index.js:     
router.get("/login", function(req, res) {
// Get an array of flash messages by passing the key to req.flash() 
    res.render("login.ejs", {message: req.flash("error")} ) ; 
})

display the message: in the views/login.ejs: 
<h1><%=message %></h1>

note: when user refresh, the flash msg disappear: it wont be persistent on that route, 
only one time thing!!! that is the reason its called flash

## Add bootstrap alerts to header
instead of putting the message to every single ejs, we should put it in the header.ejs
the question is how to keep the message info btw different views. 
-1) setup: in the app.js: store the flash message in local variables error and success: will be available to all ejs views

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error") ; 
    res.locals.success = req.flash("success") ; 
    next() ; //have to have this. very easy to forget 
}); 

-2) assign value: in routes/index.js before redirect to another route, set the flash value
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "you are logged out!") ; 
    res.redirect('/campGrounds'); 
}) ; 

-3) usage: in the views/partials/header.ejs, use bootstrap alert component: 
http://getbootstrap.com/components/#alerts

note: empty array [] in JS is truthy! so that we have to check the .length >0
<div class="container">
            <% if(error && error.length >0) {%>
                <div class="alert alert-danger" role="alert">
                    <%= error %>
                </div>
            <% } %>
            <% if(success && success.length >0) { %>
                <div class="alert alert-success" role="alert">
                    <%= success %>
                </div>
            <% } %>
</div>


## helpful errors and success messages: 
error message: check middleware/index.js:
for checkCampOwnership, checkCommentOwnership and isLoggedIn
if not logged in, then update the flash error message
if not the creator for camp/comment, then update the flash error message
if error during findById, then update the flash error message
req.flash("error", err.message);

do the same thing for routes/camps.js routes/comments.js, routes/index.js  update the error and success message
req.flash("success", "Successfully added comment");
req.flash("success", "Successfully deleted comment");
req.flash("success", "Successfully updated comment");


note: remember you have to set the flash message before the res.redirect!

learn to use err(in this case, its from passportjs: username already taken, etc) 
if (err) {
    req.flash("error", err.message);
    res.redirect(‘/register’);  
}
