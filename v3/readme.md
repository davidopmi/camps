#Camp v3
NOTE: make sure you change database connection to v3
mongoose.connect("mongodb://localhost/camp_v3") ;

##1: Refactor Mongoose Code
* Create a models directory and camp.js
move campSchema and Camp and modularize
* Use module.exports
module.exports = Camp ;
note: if you dont module.exports then the require part will get an empty obj.
* Require everything correctly!
var Camp = require('./models/camp');


##2: Add Seeds File
* Add a seeds.js file(fake data)
1: clear the database
Camp.remove()
2: add camps
function seedDB(){
    Camp.remove({}, function(err){
        if (err){
            console.log(err) ;
        }
        console.log("removed Camps") ;
    }) ;
    //add a few camp
    data.forEach(function (seed) {
        Camp.create(seed, function(err,newCamp){
            if (err){
                console.log(err);
            } else {
                console.log("created a new camp") ;
            }
        });
    }) ;
}
NOTE: how you could guarantee that add will happen after remove is finished???
3: Run the seeds file every time the server starts
note: here we export a function to be called at app.js

##3 add comment model
1: create comment.js in models folder
2: add the require
    -in seeds.js

3: add association between camp(ONE) and comment(MANY)
    - add comments property to camp model
var campSchema = new mongoose.Schema({
    name: String,
    image: String,
    desc: String,
    comments: [{
        type: mongoose.Schema.Types.ObjectId ,
        ref:"Comment"
    }]
});
note, here you reference the Comment model, but you dont need to bring it to camp.js
the camp data will be like: it has comment reference
 "_id" : ObjectId("587ae919a77bd80a7fe66fc5"), "name" : "c1",
 "image" : "https://farm3.staticflickr.com/2919/14554501150_8538af1b56.jpg",
 "desc" : "desc camp c1!", "comments" : [ ObjectId("587ae919a77bd80a7fe66fc8") ], "__v" : 1 }

4: display comments on camp show page
in app.js's /camps/:id route, we need to populate camp with comment data and then send it to the show page
Camp.findById(id).populate("comments").exec(function(err, foundCamp){})

in show.ejs: display it
<% camp.comments.forEach(function(comment){ %>
    <p>
        <strong><%= comment.author%></strong> - <%= comment.text%>
    </p>
<% })%>


#RESTFUL api convention: 7 url best practice
=============RESTFUL API============
#name    #Path          #HTTP Verb   #purpose                                  #Mongoose Method
index    '/camps'         GET        list all camps                              Camp.find()
new      '/camps/new'     GET        show new camp form                          N/A
create   '/camps'         POST       create a new cam, then redirect the index   Camp.create()
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
