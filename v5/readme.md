#Camp v5 styling for SHOW page
NOTE: make sure you change database connection to v5
mongoose.connect("mongodb://localhost/camp_v5") ;

# Style Show Page
* Section 1: Add sidebar to show page
1: camps/show.ejs
for the sidebar:
    a:Lead body copy: <p class="lead">
    http://getbootstrap.com/css/#type-body-copy
    b: list group: class="list-group" class="list-group-item"
    http://getbootstrap.com/components/#list-group
for the camp: put image, camp name, price, camp desc inside a thumbnail
    c: thumbnail: http://getbootstrap.com/components/#thumbnails
    d: Responsive images:  class="img-responsive"
    http://getbootstrap.com/css/#images-responsive
       caption:   
    d: Quick floats class="pull-right"
    http://getbootstrap.com/css/#helper-classes-floats
for the comments:
    e: wells: class="well"
    http://getbootstrap.com/components/#wells
    f: Alignment classes: class="text-right"
    http://getbootstrap.com/css/#type-alignment

<div class="container">
    <div class="row">
        <div class="col-md-3">
            <p class="lead">Camp</p>
            <div class="list-group">
                <li class="list-group-item active">Info 1</li>
            </div>
        </div>
        <div class="col-md-9">
            <img class="img-responsive" src="<%= camp.image%>" alt="">
            <div class="caption">
                <h4 class="pull-right">$9.00/night</h4>
                <!--later this should be a link-->
                <h4><a href="#"><%=camp.name%></a></h4>
                <p><%=camp.desc%></p>
            </div>
        </div>

* Section 2: Display comments nicely
        <div class="well">
            <div class="text-right">
                <a class="btn btn-success" href="/camps/<%=camp._id%>/comments/new" role="button">add new comment</a>
            </div>
            <!--add some spacing-->
            <hr>
            <!--each comment will be on a new row-->
            <% camp.comments.forEach(function(comment){ %>
                <div class="row">
                    <div class="col-md-12">
                        <!--author and days on the same line-->
                        <strong><%= comment.author%></strong>
                        <span class="pull-right"> 10 days ago</span>
                        <!--start a new line-->
                        <p>
                             <%= comment.text%>
                        </p>
                    </div>
                </div>
            <% })%>
        </div>

* Section 3: create css file for styling
a: create main.css in public/css/
add link in the header.js:
    <link rel="stylesheet" href="css/main.css">
this is relative path, because we do the setting at app.js:
 app.use(express.static(path.join(__dirname, 'public'))) ;
 our application will figure out to put public/ in front of href:
 public/css/main.css

b: in the main.css:
we want to change all the images who are inside thumbnail: note: put a space in between
/*make image inside thumbnail takes the full width*/
.thumbnail img{
    width: 100%;
}

/*remove the padding of thumbnail class*/
.thumbnail{
    padding: 0;
}


#project settings:
//settings
app.set('view engine', 'ejs') ;
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, 'public'))) ;
app.use(bodyParser.urlencoded({extended: true}));
//connect to database
mongoose.connect("mongodb://localhost/camp_v5") ;
