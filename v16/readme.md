#Camp v16 
NOTE: make sure you change database connection to v16
mongoose.connect("mongodb://localhost/camp_v16") ;

## Dynamic Price Feature
1:Add price to camp model as a String datatype

2: Add price to views/camps/new.ejs 
<div class="form-group">
    <input type="number" min="0.01" step="0.01" class="form-control" placeholder="price per night" name="price">
</div>

3: change the routes/camps.js for the create route
 
4: and views/camps/edit.ejs (new and edit forms)
<div class="form-group">
    <input type="number" min="0.01" step="0.01"  class="form-control" value="<%=camp.price%>" name="camp[price]">
</div>

5: Add price to views/camps/show.ejs (camp show page)
from:
<h4 class="pull-right">$9.00/night</h4>
to 
<h4 class="pull-right"><%=camp.price%>/night</h4>

## beautify the sign up and login form
make changes to the register.ejs and login.ejs:
put the form in the middle: class="row" class="col-md-6 col-md-offset-3"
add label: class="col-sm-2 control-label"
text in the middle: class="text-center"
http://getbootstrap.com/css/#type-alignment

## embed google map in iframe 
1: update the models/camp.js to include location String
2: update the views/camps/show.ejs: 
    include iframe tag: http://getbootstrap.com/components/#responsive-embed
    for the source, refer to this link: 
http://stackoverflow.com/questions/21140338/convert-place-name-address-to-google-maps-url-and-iframe

3: you should use &amp; not & to separate parameters in your api call
http://stackoverflow.com/questions/9084237/what-is-amp-used-for
4: update the views/camps/new.ejs 
<div class="form-group">
    <input type="text" class="form-control" placeholder="camp location" name="location">
</div>

and views/camps/edit.ejs to include the location info:
<div class="form-group">
    <input type="text" class="form-control" value="<%=camp.location%>" name="camp[location]">
</div>

5: update the routers/camps.js for the CREATE route: get the location info
var location = req.body.location ; 
var newCamp = {name:name, image: image, desc: desc, price:price , author:author, location: location} ;

note: there is some performance issue: map is loaded couple secs later than the rest of page. should do async for this issue

## show createdDate for camp and comment
1: update the models/camp.js and models/comment.js to include the created property
created: {type: Date, default: Date.now}
refer to mongoose schema: 
http://mongoosejs.com/docs/schematypes.html
note, set the default to now
2: get the moment package $ npm install --save moment

3: add the moment module to your res.locals.moment variable! so you could use it in the ejs files
in app.js: 
var moment = require('moment') ; 
res.locals.moment = moment ; 

5: update the views/camps/show.ejs: we use two moment formats:
 1: moment(xxx).format('MMM Do YY')  //Feb 18th 17
 2: moment(xxx).calendar()   //Today at 2:27 PM
 http://momentjs.com/docs/#/use-it/node-js/
 learn the concept of calling method in ejs! 
 
 for camp:
 <span class="pull-right"> <%=moment(camp.created).format('LLL')%> </span>
 for comment:
 <span class="pull-right"> <%=moment(comment.created).calendar()%></span>
 
6: pay attention to update route for camp and comment, make sure the createdDate property updated
in routers/camps.js, for the update 
    //to capture the edited time
    var camp = req.body.camp ;
    camp.created = Date.now() ;
    
in routers/comments.js, for the update 
    //to capture the edited time
    var comment = req.body.comment ;
    comment.created = Date.now() ;
    

## add review star for later

## user management: user access for later

## add user avatar for later

## ajax instant search: elastic research for later 

## weather condition in the camp area for later: need geo-location to make API call
this needs async, so will do it after ajax
npm package: node-geocoder

## form validation(ajax): email using mailchimp and tele-number twilio 

## pagination for later
http://getbootstrap.com/components/#pagination

## add video and video pop up using modal form
http://getbootstrap.com/components/#responsive-embed

## modal form for adding comment
https://www.w3schools.com/bootstrap/bootstrap_modal.asp

## Bootstrap Carousel Plugin
https://www.w3schools.com/bootstrap/bootstrap_carousel.asp


## sidebar: break down by location: east, north, etc. 


## upload image using amazon s3 service
