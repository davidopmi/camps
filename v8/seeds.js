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
    image: "https://farm8.staticflickr.com/7266/7626416312_eb51133bcc.jpg",
    desc:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
},{
    name :"c2", 
    image: "https://farm1.staticflickr.com/7/5954480_34a881115f.jpg",
    desc:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
},{
    name :"c3", 
    image: "https://farm9.staticflickr.com/8126/8997196135_9cb9601c76.jpg",
    desc:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
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