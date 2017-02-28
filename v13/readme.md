#Camp v13 Refactor Middleware
NOTE: make sure you change database connection to v13
mongoose.connect("mongodb://localhost/camp_v13") ;


* Refactor Middleware
1: create folder and file: middleware/index.js 
2: create obj middlewareObj and learn how to add functionality to this obj. 

copy the checkCampOwnership() from router/camps.js 
copy the checkCommentOwnership() from router/comments.js
copy the isLoggedIn() from router/camps.js or router/comments.js

3: get the Camp and Comment models:
var Camp = require('../models/camp');
var Comment = require('../models/comment') ;

4: and module.exports to expose this obj 

5: in the router/camps.js and router/comments.js, require the obj and start to use its functions.
// var middleware= require('../middleware/index.js') ;
var middleware= require('../middleware') ;

the reason we name the middleware file: index.js is: if you require a directory, not a file, 
by default, it will get the contents of the index.js 
