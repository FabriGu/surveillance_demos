//Webgazer p5 Link
//CLICK while looking at the cursor to launch sketch and begin training! 

var myX; 
var myY; 

webgazer.setRegression('ridge').setTracker('clmtrackr').showPredictionPoints(false).setGazeListener(function(data, elapsedTime) {
    if (data == null) {
        return;
    }
    myX = data.x; //these x coordinates are relative to the viewport
    myY = data.y; //these y coordinates are relative to the viewport
}).begin();



function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    background(234);
    console.log(webgazer);

}

function draw() {
	background(234); 
    ellipse(myX, myY, 40, 40); 
}