#Camp v7 Cleaning up/Routes refactor
NOTE: make sure you change database connection to v7
mongoose.connect("mongodb://localhost/camp_v7") ;


##Refactor The Routes
* Use Express router to reorganize all routes
1) split the routes  
-auth. routes     ---routes/index.js(for all purpose routes unrelated to a particular model)
-comments routes  ----routes/comments.js 
-camps routes   --- routes/camps.js

2) Express router: 
a) in routes/camps.js: 
var express = require('express') ;
var router = express.Router() ;

note: 
in routes/camps.js, bring in the Camp model: ../models jump out routers folder and enter models folder
var Camp       = require('../models/camp') ;
in routes/comments.js, bring in Camp and Comment models and also isLoggedIn() 
in routes/index.js, bring passport and user model

b)add all the routes to router
c) module.exports = router ; 
d) in app.js, bring in the router 
var commentRoutes = require('./routes/comments') ,
    campRoutes    = require('./routes/camps'),
    indexRoutes    = require('./routes/index') ; 
e) in app.js: tell app to use those 3 routes files
    app.use(indexRoutes) ;
    app.use(campRoutes) ;
    app.use(commentRoutes) ;

test it, should working. 

* write shorter routes: 
now, take camps routes for example, they all start with the /camps, we could short it: 
index    '/camps'        GET 
new      '/camps/new'    GET
create   '/camps'        POST
Show     '/camps/:id'    GET

in app.js: 
app.use(campRoutes) ;   change to app.use('/camps' , campRoutes) ;
so the new camps routes in routes/camps.js becomes:
index    '/'      GET
new      '/new'   GET
create   '/'      POST
Show     '/:id'   GET

do the similar change 
for routes/comments.js:
    "/camps/:id/comments/new"  --> "/new"
    "/camps/:id/comments"   ---> "/"
    app.use('/camps/:id/comments',commentRoutes) ;
for routes/index.js: 
    app.use('/',commentRoutes) ;

one error: now when you add a new comment: the log will be: 
/camps/v7/views/comments/new.ejs:5
   3| <div class="container">
   4|     <div style="width:30%;margin:0 auto; ">
>> 5|         <h1>Add New Comment to <%=camp.name%></h1>
Cannot read property 'name' of null
the reason is could not find req.params.id 
var campId = req.params.id ; 
console.log(req.params.id)  shows null 
the reason is now since we separate our routes into different files, we need to merge params from request
var router = express.Router({mergeParams: true}) ;
***you need to set mergeParams: true on the router, if you want to access params from the parent router: 
http://stackoverflow.com/questions/25260818/rest-with-express-js-nested-router



