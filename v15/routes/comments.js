var express = require("express") ; 
var router = express.Router({mergeParams: true}) ; 
var Camp = require("../models/camp.js") ; 
var Comment = require("../models/comment.js") ;
var middlewareObj = require("../middleware") ; 

//new for comment  /camps/:id/comments/new
router.get('/new' , middlewareObj.isLoggedIn ,  function(req, res) {
    //have to pick up a specific camp user clicked!!!
    var id = req.params.id ; 
    console.log("at comments route, the id is:" + id) ; 
    Camp.findById(id, function(err, foundCamp){
        if (err) {
            req.flash("error", err.message) ; 
            res.redirect("back") ;  
        } else{
            //show a new form for comment
            res.render('comments/new.ejs',{camp : foundCamp}) ; 
        }
    }) ; 
}); 
//create for comment   /camps/:id/comments
router.post('',middlewareObj.isLoggedIn, function(req,res){
    //1: find the camp
    var id = req.params.id ;
    Camp.findById(id, function(err, foundCamp) {
        //2: create a comment 
        Comment.create(req.body.comment, function(err, newComment){
            if (err) {
                req.flash("error", err.message) ; 
                res.redirect("back") ; 
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
                req.flash("success", "you successfully created a comment!") ; 
                res.redirect('/camps/'+ foundCamp._id) ; 
            }
        }); 
    }) ; 
}) ; 

//EDIT: /camps/:id/comments/:comment_id/edit
router.get('/:comment_id/edit', middlewareObj.checkCommentOwnership, function(req,res){
    // i need camp, i need comment to pass to this edit.ejs
    var camp_id = req.params.id ; 
    var comment_id = req.params.comment_id; 
    Comment.findById(comment_id, function(err, foundComment) {
        if(err){
            req.flash("error", err.message) ; 
            res.redirect("back") ; 
        } else{
            res.render("comments/edit.ejs",{camp_id: camp_id, comment:foundComment}) ; 
        }
    })
}) ; 

//UPDATE : /camps/:id/comments/:comment_id  PUT
router.put('/:comment_id',middlewareObj.checkCommentOwnership, function(req,res){
    //do the update!
    var camp_id = req.params.id ; 
    var comment_id  = req.params.comment_id  ; 
    Comment.findByIdAndUpdate(comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            req.flash("error", err.message) ; 
            res.redirect("back") ; 
        } else{
            //redirect to Camp SHOW route
            req.flash("success", "you successfully edited a comment!") ; 
            res.redirect("/camps/"+camp_id) ; 
        }
    })    
})

//DELETE /camps/:id/comments/:comment_id  DELETE
router.delete('/:comment_id',middlewareObj.checkCommentOwnership, function(req,res){
    var camp_id = req.params.id ; 
    var comment_id = req.params.comment_id ; 
    Comment.findByIdAndRemove(comment_id, function(err){
        if(err){
            req.flash("error", err.message) ; 
            res.redirect("back") ; 
        } else{
            req.flash("success", "you successfully deleted a comment!") ; 
            res.redirect("/camps/"+camp_id) ; 
        }
    })
}) ; 

//middleware

module.exports = router ; 