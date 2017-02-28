var mongoose = require("mongoose") ; 
var passportLocalMongoose = require("passport-local-mongoose") ; 
//2: create the schema
var userSchema = new mongoose.Schema({
    username : String,  
    password : String
}) ; 

userSchema.plugin(passportLocalMongoose) ; 
//3: create the model 
var User = mongoose.model("User", userSchema) ; 

//4: to exports
module.exports = User ; 