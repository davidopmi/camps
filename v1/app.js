//3 steps 
var express = require("express") ;
var app = express() ; 
var path = require("path") ; 
var bodyParser = require("body-parser") ; 

//====settings: view engine, views, public folder, body-parser 
app.set('view engine', 'ejs') ; 
app.set('views', path.join(__dirname, 'views')) ; 
app.use(express.static(path.join(__dirname,'public'))) ; 
app.use(bodyParser.urlencoded({extended:true})) ; 

//====create dummy data
var camps = [{
    name: 'c1',
    image :"https://farm1.staticflickr.com/112/316612921_f23683ca9d.jpg"
},{
    name:'c2', 
    image:"https://farm3.staticflickr.com/2535/3823437635_c712decf64.jpg"
},{
    name:'c3' , 
    image:"https://farm1.staticflickr.com/93/246477439_5ea3e472a0.jpg"
}] ; 

//2: routes 
app.get('/', function(req,res){
    res.render('landing.ejs') ; 
}) ; 
app.get('/camps', function(req,res){
    res.render('camps.ejs',{camps: camps}) ; 
}) ; 
app.get('/camps/new', function(req,res){
    res.render('new.ejs') ; 
}) ; 
//this is the place when use submit the form 
app.post('/camps',function(req, res){
    //1: get the user data
    var campName = req.body.name ;
    var campImage = req.body.image ; 
    var newCamp = {name: campName, image: campImage} ; 
    //2: update our camps array 
    camps.push(newCamp) ; 
    //3: re-render the /camps 
    res.redirect('/camps') ; 
}); 


//3: bring up your server 
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("camps server is up!!!") ; 
}); 