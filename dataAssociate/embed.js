// define user and post model/schema
var mongoose = require("mongoose") ; 

mongoose.connect("mongodb://localhost/data_v1");
//post
var postSchema = new mongoose.Schema({
    title: String , 
    content: String 
});
var Post = mongoose.model("Post", postSchema) ; 

//user
var userSchema = new mongoose.Schema({
    name : String , 
    email: String,
    posts: [postSchema]
}); 
var User = mongoose.model("User", userSchema) ; 

Post.create({
    title:"post2",
    content:"great post2!"
} , function(err, post2){
    if (err) {
        console.log(err) ; 
    } else{
         //find david from users table 
    User.findOne({name:"david"}, function(err, foundUser){
        if (err) {
            console.log(err) ; 
        } else{
            //push the post2 into david's posts array
            foundUser.posts.push(post2) ; 
            //======VERY important!!! ========
            foundUser.save(function(err, savedUser){
                console.log(savedUser) ; 
            }) ; 
        }
    }) ; 
    }
}) ; 



// //use model to create new record
// User.create({
//     name:"david",
//     email:"david@yahoo.com"
// } , function(err, newUser){
//     if (err) {
//         console.log(err) ; 
//     } else{
//         console.log("new user is:" + newUser) ; 
//     }
// }) ; 

// var user2 = new User({
//     name:"jack",
//     email:"jack@yahoo.com"  
// }) ; 
// user2.save(function(err, newUser){
//     if (err) {
//         console.log(err) ; 
//     } else{
//         console.log("new user is:" + newUser) ; 
//     }
// }) ; 