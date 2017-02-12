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
    //1: find the camp
    var id = req.params.id ;
    Camp.findById(id, function(err, foundCamp) {
        //2: create a comment 
        Comment.create(req.body.comment, function(err, newComment){
            if (err) {
                console.log(err) ; 
            } else{
                //3: add user's _id and username to newComment
                console.log("current user is:" + req.user) ; 
                newComment.author.id = req.user._id ; 
                newComment.author.username = req.user.username ; 
                newComment.save() ; 
                //4: update camp comment 
                foundCamp.comments.push(newComment) ;
                //5: save the camp 
                foundCamp.save() ; 
                //redirect to camps/:id
                res.redirect('/camps/'+ foundCamp._id) ; 
            }
        }); 
    }) ; 
}) ; 
//middleware
function isLoggedIn(req,res,next){
    if (req.isAuthenticated()) {
        return next() ; 
    } else{
        res.redirect('/login') ; 
    }
}

module.exports = router ; 