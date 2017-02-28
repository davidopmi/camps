#Camp v6 Add Auth
NOTE: make sure you change database connection to v6
mongoose.connect("mongodb://localhost/camp_v6") ;

##Auth Pt. 1- Add User Model
* Install all packages needed for auth
npm install --save express-session passport passport-local passport-local-mongoose
* Define User model 
note to add passportLocalMongoose to userSchema
var passportLocalMongoose   = require('passport-local-mongoose') ;
userSchema.plugin(passportLocalMongoose) ;

##Auth Pt. 2- Register
* Configure Passport:
1) tell app to use passport as authentication tool 
2) tell passport whats the strategy to be 

* Add register routes
* Add register template

note: check the log to see what happens if you sign up with the same user multiple times?
log:"UserExistsError" --- we get this free by using passport-local-mongoose

##Auth Pt. 3- Login
* Add login routes
* Add login template
note: think about the /register and /local authentication flow. 

##Auth pt. 4- Logout/Navbar
* Add logout route 
req.logout() ;
res.redirect('/camps') ; 

* Prevent user from adding a comment if not signed in 
* Add links to navbar 
go to header.ejs and change:
<li><a href="/login">Login</a></li>
<li><a href="/register">Sign up!</a></li>
<li><a href="/logout">Logout</a></li>
and then go to login.ejs and register.ejs to add the header and footer: note the relative path
<% include partials/header.ejs%>


- create the middleware: isLoggedIn
- add the middleware to the create comments route
app.get("/camps/:id/comments/new", isLoggedIn, function(req,res){xxx } 
app.post("/camps/:id/comments", isLoggedIn, function(req,res){xxx } 
note: you should also add the middleware for the post route, to protect from using postman 

##Auth pt. 5- Show/Hide Links
* Show/hide auth links in navbar correctly
- when you not login, you only see "Login" and "SignUp" in the navbar
- when you login, you only "Logout" in the navbar

req.user: will contain all the info about the current login user:
- undefined : could not find the user in database 
- once you login in, passport will create user obj(_id, username) into req.user

1) in /camps route: add currentUser info 
res.render('camps/index.ejs',{camps:camps, currentUser : req.user});
2) in header.ejs

 <ul class="nav navbar-nav navbar-right">
                <% if (!currentUser){ %>
                <li><a href="/login">Login</a></li>
                <li><a href="/register">Sign up!</a></li>
                <% } else{ %>
                <li>Signed In As <%= currentUser.username%></li>
                <li><a href="/logout">Logout</a></li>
                <% } %>
 </ul>
 
 note: this will work only on /camps route, other routes will complain no currentUser found. 
 the reason is we changed the header.ejs ---> solution:
    a) add the currentUser on every route
    b) use a middleware so that every route called upon will run this middleware: 
    to make the req.user available to all page
    
        app.use(function(req,res,next){
            res.locals.currentUser = req.user ;
            //middleware hijack the route's handler, so if you don't call the next(), the program will stop here
            next() ;
        }) ;
   c) you could now remove the currentUser : req.user from /camps route
    
  