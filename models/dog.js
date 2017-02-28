var mongoose = require('mongoose') ;
var dogSchema = mongoose.Schema({
    dogName: {type:String, required:true},
    dogColor: String,
    createdAt: { type: Date, default: Date.now },
    owner:{
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    }
});
dogSchema.methods.color = function(){
    return this.dogColor || "any color is good" ;
} ;
var Dog = mongoose.model('Dog', dogSchema) ;

module.exports = Dog ;
