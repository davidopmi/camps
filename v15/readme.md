#Camp v15 UI refactor 
NOTE: make sure you change database connection to v15
mongoose.connect("mongodb://localhost/camp_v15") ;

In this section, we will use HTML and CSS to create a full screen background image slider 
that uses a crossfade effect to transition between images. 
The images will be set as background-images to a modified unordered list. 
We'll use 5 images with 10 second intervals for a 50 second animation cycle.

* Edit the landing.ejs page to look like the following:

<!DOCTYPE html>
<html>
<head>
    <title>Camp</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
    <link rel="stylesheet" href="/css/landing.css">
</head>
<body>

<div class="container">
    <% if(error && error.length > 0){ %>
    <div class="alert alert-danger" role="alert">
        <%= error %>
    </div>
    <% } %>
    <% if(success && success.length > 0){ %>
    <div class="alert alert-success" role="alert">
        <%= success %>
    </div>
    <% } %>
</div>

<div id="landing-header">
    <h1>Welcome to Camps!</h1>
    <a href="/camps" class="btn btn-lg btn-success">View All Camps!</a>
</div>

<ul class="slideshow">
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
</ul>
    <% include partials/footer.ejs%>


* we need to position the welcome text and view all camps button:

    #landing-header {
      z-index: 1;
      position: relative;
      text-align: center;
      padding-top: 25%;
    }

    explanation:
    1:We set the z-index to 1 so all of the elements inside the landing-header div will be in front of the background images
    how to use z-index
    https://www.w3schools.com/cssref/pr_pos_z-index.asp
    3D: x, y, and z: 
    positive z: comes forward
    negative z: comes behind
    
    2:The position is set to relative so we can use the z-index property; the default position value is static, which ignores z-index
    how to use css position: static, relative, fixed or absolute 
    https://www.w3schools.com/cssref/pr_class_position.asp
    
    3:We use text-align to center our text and button
    4:We use padding-top to vertically center our div. this way the content looks more visually centered

* style the unordered list:
    .slideshow { 
      position: fixed;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      z-index: 0;
      list-style: none;
      margin: 0;
      padding: 0;
    }
    
    explanation:
    1) This will fix the ul to the window, positioning it in the top left corner and filling the entire screen 
    by setting width and height to 100%; note the position:fixed --- The element is positioned relative to the browser window
    2) we set the z-index to 0 to keep the background images behind the rest of the page's content; 
    3) list-style is set to none in order to hide the bullet points from the list's default styling; margin and padding are removed entirely
    
    
* style all of the list items:
    .slideshow li { 
      width: 100%;
      height: 100%;
      position: fixed;
      top: 0;
      left: 0;
      background-size: cover;
      background-position: 50% 50%;
      background-repeat: no-repeat;
      opacity: 0;
      z-index: 0;
      animation: imageAnimation 50s linear infinite; 
    }
    
    explanation:
    1) background-size: cover 
    Scale the background image to be as large as possible so that the background area is completely covered by the background image. 
    https://www.w3schools.com/cssref/css3_pr_background-size.asp
    2) background-position: 50% 50%;
    The first value is the horizontal position and the second value is the vertical. The top left corner is 0% 0%. The right bottom corner is 100% 100%. 
    https://www.w3schools.com/cssref/pr_background-position.asp
    3) background-repeat: no-repeat;
    The background-image will not be repeated
    https://www.w3schools.com/cssref/pr_background-repeat.asp
    4) opacity: 0;
    starts with faded out effect: 
    https://www.w3schools.com/cssref/css3_pr_opacity.asp
    5) z-index: 0;
    stays in the background, behind the text and button 
    6) animation: imageAnimation 50s linear infinite; 
    in this case we have an animation named imageAnimation that lasts for 50s (seconds), 
    keeps linear timing (the whole animation runs at the same speed), and loops an infinite number of times
    how animation is done:
    https://www.w3schools.com/cssref/css3_pr_animation.asp
    
* set up the image list items:
Each list item needs a background-image and the last four need an animation-delay 
(this way they all fire off one after the other in ten second intervals):
    .slideshow li:nth-child(1) { 
      background-image: url(https://farm8.staticflickr.com/7559/15756506355_b8ed9d39a2.jpg) 
    }
    .slideshow li:nth-child(2) { 
      background-image: url(https://farm7.staticflickr.com/6135/5952249358_72202c3d82.jpg);
      animation-delay: 10s; 
    }
    .slideshow li:nth-child(3) { 
      background-image: url(https://farm7.staticflickr.com/6046/6331265673_873a932f55.jpg);
      animation-delay: 20s; 
    }
    .slideshow li:nth-child(4) { 
      background-image: url(https://farm1.staticflickr.com/66/158583580_79e1c5f121.jpg);
      animation-delay: 30s; 
    }
    .slideshow li:nth-child(5) { 
      background-image: url(https://farm7.staticflickr.com/6228/6331318875_e7228c985f.jpg);
      animation-delay: 40s; 
    }
    
    explanation:
    for the 1st image, we fire/display it right away, so no need to delay and wait
    animation-delay: 40s;     
    after this, from 40s - 50s, the 2nd round of animation will begin! start from the 1st image
    https://www.w3schools.com/cssref/css3_pr_animation-delay.asp
    
    
* create the keyframes for the animation:
    @keyframes imageAnimation { 
      0% { 
        opacity: 0; 
        animation-timing-function: ease-in;
      }
      10% {
        opacity: 1;
        animation-timing-function: ease-out;
      }
      20% {
        opacity: 1
      }
      30% {
        opacity: 0
      }
    }
    
    explanation:
    The animation will be named imageAnimation, matches what we set up earlier
    
    1) From 0% to 10% (the beginning of our animation) the list item begins changing it's opacity from 0 to 1 (invisible to visible)
    2) the animation-timing-function is set to ease-in at 0% and ease-out and 10%, this makes for a more smooth fade-in 
    https://www.w3schools.com/cssref/css3_pr_animation-timing-function.asp
    3)The list item's opacity then stays at 1 until it reaches 20% at which point it fades back out, reaching 0 at 30% and staying at 0 for the remainder of the animation
    4)If we have 5 background images visible for 5 seconds each, 
    then the time it takes to fade the image in and keep it visible is 10 seconds with a 5 second crossfade/fadeout into the next image;
    reasoning: 
    The entire animation cycle for all 5 images takes 50 seconds total
    100% divided by 5 is 20% so each image's fadein and visibility should last 20% of the cycle; 
    half of 20% is 10%, that is why our fade in is from 0% to 10%, 
    then we keep it visible until 20% is reached and begin the fadeout from 20% to 30%, 
    the 5 second fadeout overlaps the next image's 5 second fadein, which is what creates the crossfade effect
    