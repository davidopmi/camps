//1: create an obj 
var middlewareObj = {} ; 
var Camp = require("../models/camp.js") ; 
var Comment = require("../models/comment.js") ; 
//2: create a function for this obj 
//authentication
middlewareObj.isLoggedIn = function(req,res,next){
        if (req.isAuthenticated()) {
        return next() ; 
    } else{
        req.flash("error","you need to login first!");
        res.redirect('/login') ; 
    }
}
//authorization for Camp
middlewareObj.checkCampOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        var id = req.params.id ; 
        Camp.findById(id, function(err, foundCamp) {
            if(err){
                req.flash("error", err.message) ; 
                res.redirect("back") ; 
            } else{
                if (foundCamp.author.id.equals(req.user._id)) {
                    return next() ; 
                } else{
                    req.flash("error", "you dont own this camp!") ; 
                    res.redirect("back") ; 
                }
            }
        })
    } else{
       
        res.redirect("back") ; 
    }
}
//authorization for Comment
middlewareObj.checkCommentOwnership = function(req,res,next){
    //checkpoint 1: is user login yet? 
    if(req.isAuthenticated()){
        //checkpoint 2: is the user the creator of this comment???
        var comment_id = req.params.comment_id ; 
        Comment.findById(comment_id, function(err, foundComment) {
            if (err) {
                req.flash("error", err.message) ; 
                res.redirect("back"); 
            } else{
                if (foundComment.author.id.equals(req.user._id)){
                return next() ; 
                } else{
                    req.flash("error", "you dont own this comment!") ; 
                    res.redirect("back"); 
                }
            }
        })
    } else{
        res.redirect("back") ; 
    }
}

module.exports = middlewareObj ; 