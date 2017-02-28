// define user and post model/schema
var mongoose = require("mongoose") ; 

mongoose.connect("mongodb://localhost/data_v2");
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
    posts: [{
        type: mongoose.Schema.Types.ObjectId ,
        ref:"Post"
    }]
}); 
var User = mongoose.model("User", userSchema) ; 

// //lets create one user, one post
// User.create({
//     name:"david",
//     email:"david@yahoo.com"
// }, function(err, newUser){
//     if (err) {
//         console.log(err) ; 
//     } else {
//         console.log(newUser) ; 
//     }
// }) ; 

// var post1 = new Post({
//     title:"post1" , 
//     content:"good post1"
// }) ;
// post1.save(function(err, savedPost){
//     if (err) {
//         console.log(err) ; 
//     } else{
//         //push the newpost to user
//         User.findOne({name:"david"}, function(err, foundUser){
//             foundUser.posts.push(savedPost) ; 
//             //save it!!!! 
//             foundUser.save(function(err, savedUser){
//                 //ignore err 
//                 console.log("=== the savedUser's posts only contains id!!!! ===")
//                 console.log(savedUser) ; 
//             }) ; 
//         })
//     }
// }); 
//===== task!!!! how to ask mongoose to get the posts by objectid and populate user table
User.findOne({name:"david"}).populate("posts").exec(function(err, foundUser){
    if (err) {
        console.log(err) ; 
    } else{
        console.log("==== check the posts property! it contains everything!!!!=====")
        console.log(foundUser) ; 
    }
}) ; 