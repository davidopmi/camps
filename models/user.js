var mongoose = require('mongoose') ;
var bcrypt = require('bcrypt-nodejs') ;
var SALT_FACTOR = 10;

var userSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    displayName: String,
    bio: String
});
//this is a do nothing function to be used in bcrypt.hash
var noop = function() {};
//Defines a function that runs before model is saved
userSchema.pre("save", function(done){
    var user = this;
    if(!user.isModified("password")){
        return done() ;
    }
    //1:Generates a salt for the hash, and calls the inner function once completed
    bcrypt.genSalt(SALT_FACTOR, function(err, salt){
        if(err){
            return done(err) ;
        }
        //2:Hashes the user’s password
        bcrypt.hash(user.password, salt,noop,function(err, hashedPassword){
            if(err){
                return done(err) ;
            }
            //3: Stores the password and continues with the saving
            user.password = hashedPassword ;
            done() ;
        })
    })
});

userSchema.methods.checkPassword = function(guess,done){
        bcrypt.compare(guess,this.password, function(err, isMatch){
            done(err,isMatch);
        });
} ;


var User = mongoose.model('User', userSchema) ;

module.exports = User ;