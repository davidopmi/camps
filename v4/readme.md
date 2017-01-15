#Camp v4
NOTE: make sure you change database connection to v3
mongoose.connect("mongodb://localhost/camp_v4") ;

# Comment New/Create
on show.ejs, we want to add button to allow user to add comment
* Discuss nested routes
for comments, we could not make:
NEW    /comments/new GET
CREATE /comments     POST
because the above url has no info about a particular camp!
we need association between camp and comment:
NEW    /camps/:id/comments/new       GET
CREATE /camps/:id/comments           POST

note: comment is dependent on camp
* Add the comment new and create routes
//show the form
app.get("/camps/:id/comments/new", function(req,res){
}) ;
//create
app.post("/camps/:id/comments", function(req,res){
}) ;
* slit the views: create camps and comments sub-folder
reason: we want to follow REST practice to name our view properly
camps/new.ejs
comments/new.ejs

step 1: /camps/:id/comments/new  GET
note: update camps/ index.ejs, new.ejs and show.ejs
change the header and footer:
from :
<% include partials/footer.ejs%>
to: relative path: go upper one level from views/camps/index.ejs to views/
and then go to partials/folder:
<% include ../partials/footer.ejs%>

* Add the new comment form
in the comments/new.ejs's form section:
we need to have camp._id to make post request
 <form action="/camps/<%=camp._id%>/comments" method="post" ...>

* trick for encapsulate value from form:
rather than:
<input type="text" class="form-control" placeholder="comment author" name="author">
and then in app.js
var author = req.body.author

we could make it much easier by using:
<input type="text" class="form-control" placeholder="comment author" name="comment[author]">
it will auto create one comment obj for us, so we dont need to do the following thing:
var text = req.body.text ;
var author = req.body.author ;
var newComment = {text: text , author: author} ;

check console.log(req.body.comment) ;
in the following POST route

Step 2: require Comment model in app.js

step 3: /camps/:id/comments   POST
need to handle the following 4 things:
    //1: lookup camp using ID
    //2: create new comment
    //3: connect new comment to camp
    //4: redirect to camp show page


step 4: add a button on camps/show.ejs for adding comment


#RESTFUL api convention: 7 url best practice
=============RESTFUL API============
#name    #Path          #HTTP Verb   #purpose                                  #Mongoose Method
index    '/camps'         GET        list all camps                              Camp.find()
new      '/camps/new'     GET        show new camp form                          N/A
create   '/camps'         POST       create a new camp, then redirect the index   Camp.create()
Show     '/camps/:id'     GET        show info about one specific camp           Camp.findById()

#mongoDB cheat-sheet:
var camp1 = new Camp({name: xxx , image: xxx}) ;
camp1.save(function(err, savedCamp){}) ;

Camp.create({name:"", image:""}, function(err, savedCamp){}) ;

Camp.findOne({name:""}, function(err, foundCamp){}) ;
Camp.remove({}, function(err){})

Camp.findById(id).populate("comments").exec(function(err,foundCamp){})

var campSchema = new mongoose.Schema({
    name: String,
    image: String,
    desc: String,
    comments: [{
        type: mongoose.Schema.Types.ObjectId ,
        ref:"Comment"
    }]
});

#project settings:
//settings
app.set('view engine', 'ejs') ;
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, 'public'))) ;
app.use(bodyParser.urlencoded({extended: true}));
//connect to database
mongoose.connect("mongodb://localhost/camp_v3") ;
