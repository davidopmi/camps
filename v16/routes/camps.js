var express = require("express") ; 
var router = express.Router() ; 
var Camp = require("../models/camp.js") ; 
var middlewareObj = require("../middleware") ; 
// var middlewareObj = require("../middleware/index.js") ;
// /camps
router.get('/', function(req,res){
    console.log(req.user) ; 
    Camp.find({ } , function(err, foundCamp){
        if (err) {
            req.flash("error", err.message) ; 
        } else{
            res.render('camps/index.ejs',{camps: foundCamp}) ; 
        }
    }) ; 
}) ; 
// /camps/new
router.get('/new', middlewareObj.isLoggedIn, function(req,res){
    res.render('camps/new.ejs') ; 
}) ; 


//SHOW route    /camps/:id
router.get('/:id',function(req, res) {
    //get the id
    var id = req.params.id ; 
    //use this id to get all info from database 
    Camp.findById(id).populate("comments").exec(function(err, foundCamp){
        if (err) {
            req.flash("error", err.message) ; 
            res.redirect("back") ; 
        } else{
            res.render("camps/show.ejs", {camp: foundCamp}) ; 
        }
    })
}); 

// /camps  This is the place when use submit the form 
router.post('/',middlewareObj.isLoggedIn, function(req, res){
    //1: get the user data
    var campName = req.body.name ;
    var campImage = req.body.image ; 
    var campDesc = req.body.desc ; 
    var campPrice = req.body.price; 
    var campLocation = req.body.location ; 
    var author = {
        id: req.user._id  , 
        username: req.user.username
    } ; 
    var newCamp = {name: campName, image: campImage, author: author, 
    desc:campDesc, price: campPrice , location: campLocation} ; 
    //add the newCamp to our database 
    Camp.create(newCamp,function(err,newCamp){
        if(err){
        req.flash("error", err.message) ; 
        res.redirect("back") ; 
    } else{
        //3: re-render the /camps 
        req.flash("success", "you successfully created a camp!") ; 
        res.redirect('/camps') ; 
    }
    }); 
}); 

//EDIT route: /camps/:id/edit GET : to show the form 
router.get('/:id/edit', middlewareObj.checkCampOwnership,  function(req, res) {
    var id = req.params.id ; 
    Camp.findById(id, function(err, foundCamp) {
        res.render("camps/edit.ejs", {camp: foundCamp}) ; 
    })
}); 


//UPDATE route: '/camps/:id'
router.put('/:id', middlewareObj.checkCampOwnership, function(req,res){
    var id = req.params.id ; 
    Camp.findByIdAndUpdate(id, req.body.camp , function(err, updatedCamp){
        if (err) {
            req.flash("error", err.message) ; 
            res.redirect("back") ; 
        } else{
            //if successfully updated, go to the SHOW route to display the updated values
            req.flash("success", "you successfully update a camp!") ; 
            res.redirect('/camps/'+updatedCamp._id) ; 
        }
    })
}); 

//DELETE route
router.delete('/:id',middlewareObj.checkCampOwnership, function(req,res){
    var id = req.params.id ; 
    Camp.findByIdAndRemove(id, function(err){
        if (err) {
            req.flash("error", err.message) ; 
            res.redirect("back") ; 
        } else{
            req.flash("success", "you successfully deleted a camp!") ; 
            res.redirect('/camps') ; 
        }
    }); 
}); 

//middleware
module.exports = router  ;