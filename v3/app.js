//3 steps 
var express = require("express") ;
var app = express() ; 
var path = require("path") ; 
var bodyParser = require("body-parser") ; 
var mongoose = require("mongoose") ; 
var Camp = require("./models/camp.js") ; 
var seedsDB = require("./seeds.js") ; 
//====settings: view engine, views, public folder, body-parser 
app.set('view engine', 'ejs') ; 
app.set('views', path.join(__dirname, 'views')) ; 
app.use(express.static(path.join(__dirname,'public'))) ; 
app.use(bodyParser.urlencoded({extended:true})) ; 

mongoose.connect("mongodb://localhost/camps_v3");
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
            res.render('camps.ejs',{camps: foundCamp}) ; 
        }
    }) ; 
    // res.render('camps.ejs',{camps: camps}) ; 
}) ; 

app.get('/camps/new', function(req,res){
    res.render('new.ejs') ; 
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
            res.render("show.ejs", {camp: foundCamp}) ; 
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


//3: bring up your server 
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("camps server is up!!!") ; 
}); 