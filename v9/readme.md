#Camp v9 Users+ Camps
NOTE: make sure you change database connection to v9
mongoose.connect("mongodb://localhost/camp_v9") ;


##Users + Camps
* Prevent an unauthenticated user from creating a camp
in the routes/camps.js, for the new route and the create route
copy the isLoggedIn and use code from routes/comments.js: 

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        //proceed
        return next() ;
    } else{
        console.log("login failed") ;
        res.redirect("/login") ;
    }

}
* Save username+id to newly created campground, just like what we did for comments

1: update the models/camp.js: add the author obj:
var campSchema = new mongoose.Schema({
    name: String,
    image: String,
    desc: String,
    comments: [{
        type: mongoose.Schema.Types.ObjectId ,
        ref:"Comment"
    }],
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId ,
            ref:"User"
        } ,
        username: String
    }
});

2: update the routes/camps.js, for the create route
var author = {
        id: req.user._id ,
        username: req.user.username
    } ;
var newCamp = {name:name, image: image, desc: desc, author:author} ;

3: update the views/camps/show.ejs page to include the author's username
<p>
    <em>Submitted By<%=camp.author.username%></em>
</p>



