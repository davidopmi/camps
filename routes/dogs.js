var express  = require('express') ;
var router = express.Router() ;
var middlewareObj = require('../middleware/index');
var flash = require("connect-flash");
var Dog = require('../models/dog') ;

//index
router.get('/',function(req,res, next){
    //Queries the dogs collection, returning the newest dogs first
    /*
     * You don’t actually run the query until exec is called.
     * Ayou can also specify a callback in find to skip having to use exec,
     * but then you can’t do things like sorting.
    * */
    Dog.find().sort({createdAt: "descending"}).exec(function(err, dogs){
        if(err){
            return next() ;
        } else{
            res.render('dogs/index.ejs', {dogs:dogs}) ;
        }
    });
});


//new
router.get('/new',middlewareObj.isLogin, function(req,res){
    res.render('dogs/new.ejs') ;
});
//create
router.post('/', middlewareObj.isLogin, function(req,res){
    var newDog = {dogName:req.body.dogName, dogColor:req.body.dogColor,
    owner:{id: req.user._id}
    } ;
    Dog.create(newDog, function(err){
        if(err){
            req.flash("errors", err.message) ;
            res.redirect("back") ;
        } else{
            res.redirect('/dogs') ;
        }
    });
});
//show
router.get('/:id', function(req,res,next){
    var id = req.params.id ;
    Dog.findById(id, function (err, foundDog) {
        if(err){
            req.flash("errors", err.message) ;
            res.redirect("back") ;
        } else{
            if(foundDog){
                res.render('dogs/show.ejs', {dog:foundDog}) ;
            } else{
                return next() ;
            }
        }
    }) ;
}) ;

//edit get
router.get('/:id/edit', middlewareObj.checkUserOwnership, function(req,res,next){
    var id = req.params.id ;
    Dog.findById(id, function (err, foundDog) {
        if(err){
            req.flash("errors", err.message) ;
            res.redirect("back") ;
        } else{
            if(foundDog){
                res.render('dogs/edit.ejs', {dog:foundDog}) ;
            } else{
                return next() ;
            }
        }
    }) ;
}) ;

//update
router.put('/:id',middlewareObj.checkUserOwnership, function (req,res,next) {
    Dog.findByIdAndUpdate(req.params.id, req.body.dog, function(err){
      if(err){
          req.flash("errors", err.message) ;
          res.redirect("back") ;
      } else{
          res.redirect('/dogs/'+req.params.id) ;
      }
    });
});

//delete
router.delete('/:id',middlewareObj.checkUserOwnership, function (req,res,next) {
    Dog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            req.flash("errors", err.message) ;
            res.redirect("back") ;
        } else{
            res.redirect('/dogs') ;
        }
    });
});
module.exports= router ;