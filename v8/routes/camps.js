var express = require("express") ; 
var router = express.Router() ; 
var Camp = require("../models/camp.js") ; 
// /camps
router.get('/', function(req,res){
    console.log(req.user) ; 
    Camp.find({ } , function(err, foundCamp){
        if (err) {
            console.log("error happend!") ; 
        } else{
            res.render('camps/index.ejs',{camps: foundCamp}) ; 
        }
    }) ; 
}) ; 
// /camps/new
router.get('/new', function(req,res){
    res.render('camps/new.ejs') ; 
}) ; 


//SHOW route    /camps/:id
router.get('/:id',function(req, res) {
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

// /camps  This is the place when use submit the form 
router.post('/',function(req, res){
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

module.exports = router  ;