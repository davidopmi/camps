# Camps V2
##1: install mongodb in your workspace on c9
could refer to https://community.c9.io/t/setting-up-mongodb/1717
step 1: install MongoDB in your workspace one level about workspace/
sudo apt-get install -y mongodb-org

step 2: create data folder for mongodb (still one level about workspace/)
$ mkdir data
$ echo 'mongod --bind_ip=$IP --dbpath=data --nojournal --rest "$@"' > mongod
$ chmod a+x mongod

step 3: start mongodb server on your project root:
$ ./mongod

step 4: start the mongodb client
$ mongo

##2: Adding Mongoose
* Install and configure mongoose
    npm install --save mongoose
* Setup camp model
    var mongoose  = require("mongoose");
    mongoose.connect("mongodb://localhost/camp") ;
    var campSchema = new mongoose.Schema({
        name: String,
        image: String
    });
    var Camp = mongoose.model("Camp", campSchema);

* create data use model
Camp.create({name:"c1", image:"https://farm2.staticflickr.com/1203/1132895352_afd086a60b.jpg"},function (err,newCamp) {
    if(err){
        console.log(err) ;
    } else{
        console.log("create a new camp") ;
        console.log(newCamp) ;
    }
});
* Use camp model inside of our routes
    1) for index route: /camps  GET
    2) find create: /camps   POST

##3: Show Page
* Review the RESTFUL routes we have seen so far
* Add a show route
app.get('/camps/:id',function (req,res) {
    res.send("this will be the show page") ;
});

note: make sure the /camps/:id is added after the /camps route!

* Add description to our camp model
var campSchema = new mongoose.Schema({
    name: String,
    image: String,
    desc: String
});

* Show db.collection.drop()
since our existing camp data does not have desc. we could delete all of them
type the command in mongo shell
db.collection.drop()
db.camps.find()

* create show template
1) add show.ejs
2) on the camps.ejs, add a button to link to show.ejs
note: to follow the restful practice, we should rename the camps.ejs to index.ejs
<p>
   <a class="btn btn-primary" href="/camps/<%=c._id%>" role="button">More Info</a>
</p>
note: this ._id is auto created for each record in mongodb
3) capture the id in the /camps/:id
var id = req.params.id ;
4) use the id to find specific camp
    Camp.findById(id, function(err, foundCamp){
        if(err){
            console.log(err) ;
        } else{
            //render show template with the foundCamp
            res.render("show.ejs", {foundCamp: foundCamp}) ;
        }
    }) ;


* Add show route template
<% include partials/header.ejs%>
    <h1>This is the show template!</h1>
    <p><%=camp.name%></p>
    <img src="<%= camp.image%>" alt="could not find the image">
    <p><%=camp.desc%></p>
<% include partials/footer.ejs%>

* Expand the new.ejs to include desc. info
<div class="form-group">
   <input type="text" class="form-control" placeholder="camp desc" name="desc">
</div>

* go to app.js to create sec. to capture the desc. info



#RESTFUL api convention: 7 url best practice
=============RESTFUL API============
#name    #Path          #HTTP Verb   #purpose                                  #Mongoose Method
index    '/camps'         GET        list all camps                              Camp.find()
new      '/camps/new'     GET        show new camp form                          N/A
create   '/camps'         POST       create a new camp, then redirect the index  Camp.create()
Show     '/camps/:id'     GET        show info about one specific camp           Camp.findById()