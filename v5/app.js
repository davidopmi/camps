//3 steps 
var express = require("express") ;
var app = express() ; 
var path = require("path") ; 
var bodyParser = require("body-parser") ; 
var mongoose = require("mongoose") ; 
var Camp = require("./models/camp.js") ; 
var Comment = require("./models/comment.js") ; 
var seedsDB = require("./seeds.js") ; 
//====settings: view engine, views, public folder, body-parser 
app.set('view engine', 'ejs') ; 
app.set('views', path.join(__dirname, 'views')) ; 
app.use(express.static(path.join(__dirname,'public'))) ; 
app.use(bodyParser.urlencoded({extended:true})) ; 

mongoose.connect("mongodb://localhost/camps_v5");
//call the seedsDB!!
seedsDB() ; 

//2: routes 
app.get('/', function(req,res){
    res.render('landing.ejs') ; 
}) ; 
app.get('/camps', function(req,res){
    //we need to fetch data from database and then display it!!!
    //.find({}, )
    Camp.find({ } , function(err, foundCamp){
        if (err) {
            console.log("error happend!") ; 
        } else{
            res.render('camps/index.ejs',{camps: foundCamp}) ; 
        }
    }) ; 
    // res.render('camps.ejs',{camps: camps}) ; 
}) ; 

app.get('/camps/new', function(req,res){
    res.render('camps/new.ejs') ; 
}) ; 


//SHOW route
app.get('/camps/:id',function(req, res) {
    //get the id
    var id = req.params.id ; 
    //use this id to get all info from database 
    Camp.findById(id).populate("comments").exec(function(err, foundCamp){
        if (err) {
            console.log(err) ; 
        } else{
            console.log(foundCamp) ; 
            res.render("camps/show.ejs", {camp: foundCamp}) ; 
        }
    })
}); 

//this is the place when use submit the form 
app.post('/camps',function(req, res){
    //1: get the user data
    var campName = req.body.name ;
    var campImage = req.body.image ; 
    var newCamp = {name: campName, image: campImage} ; 
    //add the newCamp to our database 
    Camp.create(newCamp,function(err,newCamp){
        if(err){
        console.log(err) ; 
    } else{
      //3: re-render the /camps 
    res.redirect('/camps') ; 
    }
    }); 
}); 


//========= for comment ===============
//new for comment
app.get('/camps/:id/comments/new' , function(req, res) {
    //have to pick up a specific camp user clicked!!!
    var id = req.params.id ; 
    Camp.findById(id, function(err, foundCamp){
        if (err) {
            console.log(err) ; 
        } else{
            //show a new form for comment
            res.render('comments/new.ejs',{camp : foundCamp}) ; 
        }
    }) ; 
}); 
//create for comment 
app.post('/camps/:id/comments', function(req,res){
    //get the data
    console.log(req.body.comment) ; 
    //find the camp
    var id = req.params.id ;
    Camp.findById(id, function(err, foundCamp) {
        //create a comment 
        Comment.create(req.body.comment, function(err, newComment){
            if (err) {
                console.log(err) ; 
            } else{
                //update camp comment 
                foundCamp.comments.push(newComment) ;
                        //save the camp 
                foundCamp.save() ; 
                //redirect to camps/:id
                res.redirect('/camps/'+ foundCamp._id) ; 
            }
        }); 
    }) ; 
}) ; 



//============end of comment============

//3: bring up your server 
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("camps server is up!!!") ; 
}); 