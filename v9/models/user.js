var mongoose = require("mongoose") ; 
var passportLocalMongoose = require("passport-local-mongoose") ; 

var userSchema = new mongoose.Schema({
    username: String ,
    password: String
}); 
// insert the passportLocalMongoose into userSchema
userSchema.plugin(passportLocalMongoose) ; 

var User = mongoose.model("User", userSchema) ; 
module.exports = User ; 