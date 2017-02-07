#Camp v10 Users+ Camps
NOTE: make sure you change database connection to v10
mongoose.connect("mongodb://localhost/camp_v10") ;

## Edit Camps
* Add Method-Override: form could ONLY do GET and POST, so for PUT(update) and DELETE, we need to override it
npm install --save method-override   
https://www.npmjs.com/package/method-override
following the API: 
var express = require('express')
var methodOverride = require('method-override')
var app = express()
 
// override with POST having ?_method=DELETE 
app.use(methodOverride('_method'))
Example call with query override using HTML <form>:

<form method="POST" action="/resource?_method=DELETE">
  <button type="submit">Delete resource</button>
</form>


* Add Edit Route for camps
in routers/camps.js: add router.get('/:id/edit') route
* Add the views/camps/edit.ejs:
use the same views/camps/view.ejs form, change the action: 
<form action="/camps/<%=camp._id%>?_method=PUT" method="post" style="margin:30px auto;">

* Add Link to Edit Page 
in the views/camps/show.ejs: add the button with link 
<a class="btn btn-warning" href="/camps/<%=camp._id%>/edit" role="button">Edit</a>

* change the input tags, replace the placeholder attribute to value="" to show existing value
<input type="text" class="form-control" value="<%=camp.name%>" name="camp[name]" >
note: refer to the views/comments/new.ejs to see how we wrap the name values in a obj


* Add Update Route: learn the Camp.findByIdAndUpdate(id, CampObj, function(err, updatedCamp){})
router.put('/:id', function (req,res) {
    var id = req.params.id ;
    Camp.findByIdAndUpdate(id, req.body.camp,  function (err, updatedCamp) {
        if(err){
            res.redirect('/camps') ;
        } else{
            res.redirect('/camps/' + id) ;
        }
    }) ;
}) ;

req.body.camp: name, image, and desc 

* Fix $set problem 

## Deleting Camps
* Add Delete button
note, you have to make a form to be able to send the delete request.
* Add Destroy Route
router.delete('/:id', function (req,res) {
    var id = req.params.id ;
    Camp.findByIdAndRemove(id, function (err) {
        if(err){
            res.redirect('/camps') ;
        } else{
            //note, you could not go back to the SHOW page since this camp already be deleted!
            res.redirect('/camps/') ;
        }
    }) ;
}) ;
* change the Delete button to be inline with the Edit button
since currently we use the form which is a block element, to be able to be in line with Edit, we need to use the following in
main.css:

#delete-form{
    display: inline;
}

note: make sure in your views/partials/header.ejs: from header.ejs, have to jump one levle.
<link rel="stylesheet" href="../css/main.css">

## Authorization 
* User can only edit his/her camps
* User can only delete his/her camps
* Hide/Show edit and delete buttons

## Refactoring middleware
