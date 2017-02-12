#Camp v12 Edit, Update and Delete for Comments

NOTE: make sure you change database connection to v12
mongoose.connect("mongodb://localhost/camp_v12") ;

## Editing Comments
* Add Edit route for comments
/camps/:id/edit    GET
/camps/:id/comments/:comment_id/edit   GET

* Add Edit button
<a class="btn btn-xs btn-warning"
       href="/camps/<%=camp._id%>/comments/<%=comment._id%>/edit"
       role="button">Edit
</a>
* Create the Edit ejs
use the template of views/comments/new.ejs
<form action="/camps/<%=camp_id%>/comments/<%=comment._id%>?_method=put" 
method="post" style="margin:30px auto;">
* Add Update route
/camps/:id/comments/:comment_id  put

## Deleting Comments 
* Add Destroy route
camp delete route: /camps/:id  delete
comments delete route: /camps/:id/comments/:comment_id  delete

router.delete('/:comment_id', function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back") ;
        } else{
            //go back to the camp's show page
            res.redirect('/camps/'+req.params.id) ;
        }
    }) ;
}) ;

* Add Delete button 
<form id="delete-form" action="/camps/<%=camp._id%>/comments/<%=comment._id%>?_method=delete" method="post">
    <input type="submit" class="btn btn-xs btn-danger" value="delete">
</form>


## Authorization part 2: Comments
* User can only edit his/her comments
* Use can only delete his/her comments

function checkCommentOwnership(req,res, next){
    //check 1: does the user sign in?
    if(req.isAuthenticated()){
        var comment_id = req.params.comment_id ;
        Comment.findById(comment_id, function(err, foundComment){
            if(err){
                res.redirect("back") ;
            } else{
                //check 2: does the user own the comment?
                if(!foundComment.author.id.equals(req.user._id)){
                    res.redirect("back") ;
                } else{
                    return next() ;
                }
            }
        }) ;
    } else{
        res.redirect("back") ;
    }
}

* Hide/Show edit and delete buttons

update the views/camps/show.ejs 
<%if(currentUser && comment.author.id.equals(currentUser._id)) { %>
    <a class="btn btn-xs btn-warning"
       href="/camps/<%=camp._id%>/comments/<%=comment._id%>/edit"
       role="button">Edit
    </a>
    <form id="delete-form" action="/camps/<%=camp._id%>/comments/<%=comment._id%>?_method=delete" method="post">
        <input type="submit" class="btn btn-xs btn-danger" value="delete">
    </form>
<% } %>
