var Dog = require('../models/dog') ;
var middlewareObj = {} ;
middlewareObj.isLogin = function(req,res,next){
    if(req.isAuthenticated()){
        return next() ;
    } else{
       req.flash('info', 'you need to login to do this') ;
       res.redirect("back") ;
    }
} ;

middlewareObj.checkUserOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        var id = req.params.id ;
        Dog.findById(id, function (err, foundDog) {
            if(err){
                req.flash("errors", err.message) ;
                res.redirect("back") ;
            } else{
                if(foundDog.owner.id.equals(req.user._id)) {
                    return next() ;
                } else{
                    res.redirect("back") ;
                }
            }
        }) ;
    } else{
        req.flash('info', 'you need to login to do this') ;
        res.redirect("back") ;
    }
} ;


module.exports = middlewareObj ;