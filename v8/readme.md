#Camp v8 Users+ Comments
NOTE: make sure you change database connection to v8
mongoose.connect("mongodb://localhost/camp_v8") ;


* Associate users and comments 
every comment is linked with username and userid
note, in the models/comment.js we could store the whole user in it, but its not necessary
{
    username:"david",
    _id: 123456789,
    hash:"asfasfasfasf",
    salt:"asfasfsafsdfsdfasf"
}

we just store the username and id(note the id will be ref to user's id)--- refer to models/camp.js 
var commentSchema = new mongoose.Schema({
    text: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId ,
            ref:"User"
        } ,
        username: String
    }
});

change the seeds.js: dont use seedDB() ; 



* Save author's name to a comment automatically 
change the code in routes/comments.js, before saving the comment to camp, 
add username and id to a comment and then save comment 
req.user(has two properties: username and _id) could tell use the current user! But make sure your logic force the user login already! 
req.user.username
req.user._id 

remove author input from views/comments/new.ejs file

so the create new comment route's logic: 
//1: lookup camp using ID
//2: create new comment
//3: add username and id to comment
//4: save comment
//5: connect/associate new comment to camp
//6: save the Camp
//7: redirect to camp show page

make changes to the views/camps/show.ejs: 
    from: current flat print out the whole author js obj
    <strong><%= comment.author%></strong>
    to: 
    <strong><%= comment.author.username%></strong>
    
    also, remove views/comments/new.ejs: dont need to ask for username!
     <div class="form-group">
        <input type="text" class="form-control" placeholder="author" name="comment[author]">
    </div>