//3 steps 
var express = require("express") ;
var app = express() ; 
var path = require("path") ; 
var bodyParser = require("body-parser") ; 
var mongoose = require("mongoose") ; 

//====settings: view engine, views, public folder, body-parser 
app.set('view engine', 'ejs') ; 
app.set('views', path.join(__dirname, 'views')) ; 
app.use(express.static(path.join(__dirname,'public'))) ; 
app.use(bodyParser.urlencoded({extended:true})) ; 

mongoose.connect("mongodb://localhost/camps");
var campSchema = new mongoose.Schema({
    name: String ,
    image: String 
}); 
var Camp = mongoose.model("Camp", campSchema) ; 
//===create a record
// Camp.create({
//     name: 'c1',
//     image :"https://farm1.staticflickr.com/112/316612921_f23683ca9d.jpg"
// },function(err,newCamp){
//   if(err){
//       console.log(err) ; 
//   } else{
//       console.log("oh yeah, I created one record!"); 
//       console.log(newCamp) ; 
//   }
// }); 


//====create dummy data
// var camps = [{
//     name: 'c1',
//     image :"https://farm1.staticflickr.com/112/316612921_f23683ca9d.jpg"
// },{
//     name:'c2', 
//     image:"https://farm3.staticflickr.com/2535/3823437635_c712decf64.jpg"
// },{
//     name:'c3' , 
//     image:"https://farm1.staticflickr.com/93/246477439_5ea3e472a0.jpg"
// }] ; 

//2: routes 
app.get('/', function(req,res){
    res.render('landing.ejs') ; 
}) ; 
app.get('/camps', function(req,res){
    //we need to fetch data from database and then display it!!!
    //.find({}, )
    Camp.find({ } , function(err, foundCamp){
        if (err) {
            console.log("error happend!") ; 
        } else{
            res.render('camps.ejs',{camps: foundCamp}) ; 
        }
    }) ; 
    // res.render('camps.ejs',{camps: camps}) ; 
}) ; 

app.get('/camps/new', function(req,res){
    res.render('new.ejs') ; 
}) ; 


//SHOW route
app.get('/camps/:id',function(req, res) {
    //get the id
    var id = req.params.id ; 
    //use this id to get all info from database 
    Camp.findById(id, function(err, foundCamp){
        if (err) {
            console.log(err) ; 
        } else{
            res.render('show.ejs', {camp: foundCamp}) ; 
        }
    }); 
}); 

//this is the place when use submit the form 
app.post('/camps',function(req, res){
    //1: get the user data
    var campName = req.body.name ;
    var campImage = req.body.image ; 
    var newCamp = {name: campName, image: campImage} ; 
    //add the newCamp to our database 
    Camp.create(newCamp,function(err,newCamp){
        if(err){
        console.log(err) ; 
    } else{
      //3: re-render the /camps 
    res.redirect('/camps') ; 
    }
    }); 
}); 


//3: bring up your server 
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("camps server is up!!!") ; 
}); 