// video capture object
var capture
// logic for flipping the incoming video feed
var videoRepositioned = false

var dragons = []

//state of the game
// 0 for color selecting, 1 for drawing 
var gameState = 0

//variables for color selecting
var selectState = 0
var coolDownTimer = 0

//variables for drawing 
//0 for rosea, 1 for woodsprite, 2 
var drawType = 0

// color we want to track
var Rs = []
var Gs = []
var Bs = []
var r, g, b

// what is our current threshold?  This is how sensitve our color detection algorithm should be
// low numbers means more sensitivity, high numbers mean less sensitivity (aka false positives)
var threshold = 10;

// artwork
var rosea, woodsprite;

// user's location
var userLocX = 0;
var userLocY = 0;

// variable for rosea
var roseaX = []
var roseaY = []

var woodspriteX = []
var woodspriteY = []

var dragon0X = []
var dragon0Y = []
var dragon1X = []
var dragon1Y = []
var dragon2X = []
var dragon2Y = []

function preload() {
  rosea = loadImage('images/rosea.png')
  woodsprite = loadImage('images/woodsprite.png')
  dragons.push(loadImage('images/dragon1.png'))
  dragons.push(loadImage('images/dragon2.png'))
  dragons.push(loadImage('images/dragon3.png'))
  pandora = loadImage('images/pandora.jpg')
}

function setup() {
  createCanvas(640, 480);

  // start up our web cam
  capture = createCapture({
    video: {
      mandatory: {
        minWidth: 640,
        minHeight: 480,
        maxWidth: 640,
        maxHeight: 480
      }
    }
  });
  capture.hide();

}

function draw() {

  // expose the pixels in the incoming video stream
  capture.loadPixels();

  // if we have some pixels to work wtih them we should proceed
  if (capture.pixels.length > 0) {

    // draw the video
    imageMode(CORNER);
    image(capture, 0, 0);
  }

  if (gameState == 0) {

    fill(102, 102, 255)
    textAlign(CENTER)
    textSize(32)
    text("Assign colors to the following creatures", width / 2, 50)
    text("by clicking on the colors you like", width / 2, 100)

    imageMode(CENTER)
    image(rosea, 100, 200, 100, 120)
    image(woodsprite, 300, 200, 169, 86)
    image(dragons[0], 500, 200, 114, 115)

    //show the color of each creature

    for (var i = 0; i < Rs.length; i++) {
      noStroke()
      fill(Rs[i], Gs[i], Bs[i])
      ellipse(100 + i * 200, 350, 100, 100)
    }

    //assign colors by order
    coolDownTimer -= 1

    if (selectState < 3 && mouseIsPressed && coolDownTimer <= 0) {
      // memorize the color the user is clicking on
      var loc = int((mouseX + mouseY * capture.width) * 4);
      Rs.push(capture.pixels[loc])
      Gs.push(capture.pixels[loc + 1])
      Bs.push(capture.pixels[loc + 2])

      //go to next creature
      selectState += 1
      coolDownTimer = 60
    }

    if (selectState >= 3 && coolDownTimer <= 0) {
      gameState = 1
    }

  }

  if (gameState == 1) {
    coolDownTimer -= 1
    if (mouseIsPressed) {
      imageMode(CORNER)
      image(pandora, 0, 0, 640, 480)
    }

    // flip the order of the video, if necessary
    if (!videoRepositioned) {
      // get a DOM reference to the video and canvas
      var videoElement = document.querySelector('video');
      var canvasElement = document.querySelector('canvas');
      if (videoElement) {
        videoElement.style['transform'] = 'scale(-1,1)';
        videoElement.style['filter'] = 'flipH';

        canvasElement.style['transform'] = 'scale(-1,1)';
        canvasElement.style['filter'] = 'flipH';

        videoRepositioned = true;
      }
    }


    //draw roseas
    for (var i = 0; i < roseaX.length; i++) {
      imageMode(CENTER)
      image(rosea, roseaX[i], roseaY[i], 100, 120)
    }

    //draw woodsprites
    for (var i = 0; i < woodspriteX.length; i++) {
      imageMode(CENTER)
      image(woodsprite, woodspriteX[i], woodspriteY[i], 169, 86)
    }

    //draw dragons
    for (var i = 0; i < dragon0X.length; i++) {
      imageMode(CENTER)
      image(dragons[0], dragon0X[i], dragon0Y[i], 114, 115)
    }
    for (var i = 0; i < dragon1X.length; i++) {
      imageMode(CENTER)
      image(dragons[1], dragon1X[i], dragon1Y[i], 117, 198)
    }
    for (var i = 0; i < dragon0X.length; i++) {
      imageMode(CENTER)
      image(dragons[2], dragon2X[i], dragon2Y[i], 128.6, 78.8)
    }

    if (mouseIsPressed && coolDownTimer < 0) {
      saveCanvas('myCanvas', 'jpg')
      coolDownTimer = 60
    }

  }

}


function keyPressed() {


  //CHANGE threshold
  if (key == 'A' || key == 'a') {
    threshold--;
    console.log("Threshold is now: " + threshold);
  }
  if (key == 'D' || key == 'd') {
    threshold++;
    console.log("Threshold is now: " + threshold);
  }



  if (keyCode == 32 && gameState == 1) {
    // if we have some pixels to work wtih them we should proceed
    if (capture.pixels.length > 0) {

      // set up variables to test for the best pixel
      var bestLocations = [[], [], []];

      for (var i = 0; i < capture.pixels.length; i += 4) {
        // determine how close of a match this color is to our desired color
        for (var j = 0; j < Rs.length; j++) {
          var match = dist(Rs[j], Gs[j], Bs[j], capture.pixels[i], capture.pixels[i + 1], capture.pixels[i + 2]);
          if (match < threshold) {
            // this pixel qualifies!  store its location into our array
            bestLocations[j].push(i);
          }
        }
      }

      //do we have a best match?  it's possible that no pixels met our threshold
      for (var j = 0; j < bestLocations.length; j++) {
        if (bestLocations[j].length > 0) {
          // average up all of our locations
          var xSum = 0;
          var ySum = 0;
          for (var i = 0; i < bestLocations[j].length; i++) {
            xSum += (bestLocations[j][i] / 4) % 640;
            ySum += (bestLocations[j][i] / 4) / 640;
          }

          // average our sums to get our 'centroid' point
          if (j == 0) {
            roseaX.push(xSum / bestLocations[j].length)
            roseaY.push(ySum / bestLocations[j].length)
          }
          if (j == 1) {
            woodspriteX.push(xSum / bestLocations[j].length)
            woodspriteY.push(ySum / bestLocations[j].length)
          }
          if (j == 2) {
            var dragonType = random(0, 3)
            if (dragonType <= 1) {
              dragon0X.push(xSum / bestLocations[j].length)
              dragon0Y.push(ySum / bestLocations[j].length)
            } else if (dragonType <= 2) {
              dragon1X.push(xSum / bestLocations[j].length)
              dragon1Y.push(ySum / bestLocations[j].length)
            } else if (dragonType <= 3) {
              dragon2X.push(xSum / bestLocations[j].length)
              dragon2Y.push(ySum / bestLocations[j].length)
            }

          }
        }
      }

    }

  }
}

