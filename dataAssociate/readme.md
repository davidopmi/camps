# two ways to create record:
//use model to create new record
User.create({
    name:"david",
    email:"david@yahoo.com"
} , function(err, newUser){
    if (err) {
        console.log(err) ; 
    } else{
        console.log("new user is:" + newUser) ; 
    }
}) ; 

var user2 = new User({
    name:"jack",
    email:"jack@yahoo.com"  
}) ; 
user2.save(function(err, newUser){
    if (err) {
        console.log(err) ; 
    } else{
        console.log("new user is:" + newUser) ; 
    }
}) ; 


# embed 
user.posts.push
make sure you save it

# obj. reference 
