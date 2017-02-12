#Camp v11 Authorization for Camp

NOTE: make sure you change database connection to v11
mongoose.connect("mongodb://localhost/camp_v11") ;


note: Authentication vs Authorization:
Authentication: refer to finding out someone is what they say they are(who are you? check the ID)
Authorization: once you know who it is, you find out what they are allowed to do(check the permission)

* User can only edit his/her camps
* User can only delete his/her camps
for the edit, update and delete routes: we need to check 
does the current user's id matches camp's Author's id
(since we already associated user+camp we could do that )

note when you try to compare  req.user._id === foundCamp.author.id:
req.user._id : is a string
foundCamp.author.id : is an object
so to compare them, you could:
1) use the mongoose method: obj.equals(string):
foundCamp.author.id.equals(req.user._id )
2) use the:  JSON.stringify(obj1) === JSON.stringify(obj2)
3) response.redirect("back") ; 

the code for EDIT Authentication is:
//EDIT CAMP ROUTE: show the form
router.get('/:id/edit', function (req,res) {
    //1: check is user logged in at all, if not, redirect to somewhere
    if(req.isAuthenticated()){
        var id = req.params.id ;
        Camp.findById(id, function (err, foundCamp) {
            if(err){
                res.redirect('/camps') ;
            } else{
                //2: if user logged in, does the user owns this camp? //if so, proceed; if not, then redirect
                // console.log("type:" + typeof foundCamp.author.id  + foundCamp.author.id ) ;
                // console.log("type:" + typeof req.user._id  + req.user._id ) ;
                if(foundCamp.author.id.equals(req.user._id)){
                    res.render('camps/edit.ejs', {camp:foundCamp}) ;
                } else{
                    res.send("you dont have rights to edit this camp") ;
                }
            }
        }) ;
    } else{
        console.log("you need to login to do that!!!");
        res.redirect("/camps") ;
    }
}) ;

* create a middleware to re-use the logic for EDIT, UPDATE and DELETE
function checkCampOwnership(req,res, next) {
    if(req.isAuthenticated()){
        var id = req.params.id ;
        Camp.findById(id, function (err, foundCamp) {
            if(err){
                res.redirect('back') ;

            } else{
                if(foundCamp.author.id.equals(req.user._id)){
                   return next();
                } else{
                    res.redirect("back") ;
                }
            }
        }) ;
    } else{
        res.redirect("back") ;
    }
}

the edit route will be:
router.get('/:id/edit', checkCampOwnership, function (req,res) {
    Camp.findById(req.params.id, function(err, foundCamp){
        res.render('camps/edit.ejs', {camp:foundCamp}) ;
    }) ; 
}) ;

* Hide/Show edit and delete buttons
in the views/camps/show.ejs, wrap the two buttons with following: 
<% if (currentUser && camp.author.id.equals(currentUser._id)) { %>
    <a class="btn btn-warning" href="/camps/<%=camp._id%>/edit" role="button">Edit</a>
    <form id="delete-form" action="/camps/<%=camp._id%>?_method=delete" method="post">
        <button class="btn btn-danger"> delete</button>
    </form>
<%}%>
note, we could not use: foundCamp.author.id.equals(req.user._id)
but in app.js we defined res.locals.currentUser = req.user
