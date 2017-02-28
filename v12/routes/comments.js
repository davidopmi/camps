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

//EDIT: /camps/:id/comments/:comment_id/edit
router.get('/:comment_id/edit', checkCommentOwnership, function(req,res){
    // i need camp, i need comment to pass to this edit.ejs
    var camp_id = req.params.id ; 
    var comment_id = req.params.comment_id; 
    Comment.findById(comment_id, function(err, foundComment) {
        if(err){
            res.redirect("back") ; 
        } else{
            res.render("comments/edit.ejs",{camp_id: camp_id, comment:foundComment}) ; 
        }
    })
}) ; 

//UPDATE : /camps/:id/comments/:comment_id  PUT
router.put('/:comment_id',checkCommentOwnership, function(req,res){
    //do the update!
    var camp_id = req.params.id ; 
    var comment_id  = req.params.comment_id  ; 
    Comment.findByIdAndUpdate(comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back") ; 
        } else{
            //redirect to Camp SHOW route
            res.redirect("/camps/"+camp_id) ; 
        }
    })    
})

//DELETE /camps/:id/comments/:comment_id  DELETE
router.delete('/:comment_id',checkCommentOwnership, function(req,res){
    var camp_id = req.params.id ; 
    var comment_id = req.params.comment_id ; 
    Comment.findByIdAndRemove(comment_id, function(err){
        if(err){
            res.redirect("back") ; 
        } else{
            res.redirect("/camps/"+camp_id) ; 
        }
    })
}) ; 

//middleware
function isLoggedIn(req,res,next){
    if (req.isAuthenticated()) {
        return next() ; 
    } else{
        res.redirect('/login') ; 
    }
}
//for EDIT/UPDATE/DELETE
function checkCommentOwnership(req,res,next){
    //checkpoint 1: is user login yet? 
    if(req.isAuthenticated()){
        //checkpoint 2: is the user the creator of this comment???
        var comment_id = req.params.comment_id ; 
        Comment.findById(comment_id, function(err, foundComment) {
            if (err) {
                res.redirect("back"); 
            } else{
                if (foundComment.author.id.equals(req.user._id)){
                return next() ; 
                } else{
                    res.redirect("back"); 
                }
            }
        })
    } else{
        res.redirect("back") ; 
    }
}


module.exports = router ; 