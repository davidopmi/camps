/*
1: delete all the data in your database 
2: then add new data to your database 
create a camp 
create a comment
push the comment into the camp
*/
var mongoose = require("mongoose") ; 
var Camp = require("./models/camp.js") ; 
var Comment = require("./models/comment.js") ; 

var data = [{
    name :"c1", 
    image: "https://farm8.staticflickr.com/7266/7626416312_eb51133bcc.jpg"
},{
    name :"c2", 
    image: "https://farm1.staticflickr.com/7/5954480_34a881115f.jpg"
},{
    name :"c3", 
    image: "https://farm9.staticflickr.com/8126/8997196135_9cb9601c76.jpg"
}] ; 

function seedsDB(){
    Camp.remove({ } , function(err){
    if (err) {
        console.log(err) ; 
    } else{
        //after data is deleted, we push in new data!!!
        data.forEach(function(camp){
            Camp.create(camp, function(err, newCamp){
                //we need to expand camp schema to have reference for comment
                Comment.create({
                    text:"good camp!" , 
                    author:"david"
                }, function(err, newComment){
                    if (err) {
                        console.log(err) ; 
                    } else{
                        console.log("new comment saved") ; 
                        newCamp.comments.push(newComment) ; 
                        newCamp.save(function(err, savedCamp) {
                            console.log("new camp saved") ; 
                        })
                    }
                })
            })
        }) ; 
    }
}) ; 
}

//.remove({}, function(err){} )

//======= the biggest problem!!!!
module.exports = seedsDB ; 