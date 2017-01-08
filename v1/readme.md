# Camps V1:
## part 1: 3 initial routes
package: ejs express 
npm install --save ejs express 

/   : home route or root route 
/camps : list all the camps we have 
/camps/new : this is for create new camps 

skeleton for our project: 
public: 
    css: 
    js: 
views: 
    landing.ejs
    camps.ejs
    new.esj
    partials: 
    
data and what to display on the camps page:


for /camps/new   :
form with: 
    name 
    image 
    button 
once user clicked the button/submit the form, it will go to the /camps page
and display all the camps along with the newly created one
note: difference between GET and POST
GET: to get info from server
POST: to add into to the server
in order for POST to work, we need another package :
body-parser 
npm install --save body-parser 
var bodyParser = require("body-parser") ; 
app.use(bodyParser.urlencoded({extended:true})) ; 

#part 2: layout and basic styling 
1: create header.ejs and footer.ejs in the partials folder
2: get bootstrap CDN and put it in the header.ejs

jumbotron
grid system
thumbnail  display:flex ; flex:wrap:wrap ; 
form
button
navbar 