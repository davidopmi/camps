var express = require("express") ; 
var router = express.Router({mergeParams: true}) ; 
var Camp = require("../models/camp.js") ; 
var Comment = require("../models/comment.js") ;

//new for comment  /camps/:id/comments/new
router.get('/new' , isLoggedIn ,  function(req, res) {
    //have to pick up a specific camp user clicked!!!
    var id = req.params.id ; 
    console.log("at comments route, the id is:" + id) ; 
    Camp.findById(id, function(err, foundCamp){
        if (err) {
            console.log(err) ; 
        } else{
            //show a new form for comment
            res.render('comments/new.ejs',{camp : foundCamp}) ; 
        }
    }) ; 
}); 
//create for comment   /camps/:id/comments
router.post('',isLoggedIn, function(req,res){
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

function isLoggedIn(req,res,next){
    if (req.isAuthenticated()) {
        return next() ; 
    } else{
        res.redirect('/login') ; 
    }
}

module.exports = router ; 