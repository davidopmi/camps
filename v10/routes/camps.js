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
router.get('/new', isLoggedIn, function(req,res){
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
router.post('/',isLoggedIn, function(req, res){
    //1: get the user data
    var campName = req.body.name ;
    var campImage = req.body.image ; 
    var author = {
        id: req.user._id  , 
        username: req.user.username
    } ; 
    var newCamp = {name: campName, image: campImage, author: author} ; 
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

//EDIT route: /camps/:id/edit GET : to show the form 
router.get('/:id/edit', function(req, res) {
    var id = req.params.id ; 
    Camp.findById(id, function(err, foundCamp){
        if (err) {
            console.log(err) ; 
        } else{
            res.render("camps/edit.ejs", {camp: foundCamp}) ; 
        }
    })
}); 


//UPDATE route: '/camps/:id'
router.put('/:id', function(req,res){
    var id = req.params.id ; 
    Camp.findByIdAndUpdate(id, req.body.camp , function(err, updatedCamp){
        if (err) {
            console.log(err) ; 
        } else{
            //if successfully updated, go to the SHOW route to display the updated values
            res.redirect('/camps/'+updatedCamp._id) ; 
        }
    })
}); 

//DELETE route
router.delete('/:id', function(req,res){
    var id = req.params.id ; 
    Camp.findByIdAndRemove(id, function(err){
        if (err) {
            console.log(err) ; 
        } else{
            res.redirect('/camps') ; 
        }
    }); 
}); 


//middleware
function isLoggedIn(req,res,next){
    if (req.isAuthenticated()) {
        return next() ; 
    } else{
        res.redirect('/login') ; 
    }
}

module.exports = router  ;