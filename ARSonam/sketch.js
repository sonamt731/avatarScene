// create a variable to hold our world object
var world;

//game state
var lost = false;
var gameOvX;
var gameOvY;
var boulderCount = 0;

//background
var pandoraBg;

// create variables to hold our markers
var markerHiro;

// where our player is current hanging out at
var playerX, playerY;

// artwork for our player
var playerArtwork;

// a bunch of coins
var woodsprites = [];
var boulders = [];

// points
var points = 0;

//video reposition code altered from Kapp's lecture demo
var videoRepositioned = false;

function preload() {
  player = loadImage("images/neytiri.png");
  woodSprite1 = loadImage("images/woodSprite1.png");
  woodSprite2 = loadImage("images/woodSprite3.png");
  boulder = loadImage("images/boulder.png");
  gameOver = loadImage("images/gameOver.png");
  eXX = loadImage("images/x.png");
  pandoraBg = loadImage("images/pandora.jpg");
}

function setup() {
  // create our world (this also creates a p5 canvas for us)
  world = new World('ARScene');

  // grab a reference to our two markers that we set up on the HTML side (connect to it using its 'id')
  markerHiro = world.getMarker('hiro');

  // place the player in the middle of the screen
  playerX = width/2;
  playerY = height/2;

  // create a lots of woodsprites
  for (var i = 0; i < 25; i++) {
    woodsprites.push(new woodSprite());
  }

  for (var j = 0; j < 10; j++){
    boulders.push(new Boulder());
  }
}


function draw() {
  // erase the background
  world.clearDrawingCanvas();

  imageMode(CENTER);
  image(pandoraBg, width/2,height/2);

   // flip the order of the video, if necessary
  if (!videoRepositioned) {
    // get a DOM reference to the video and put it on top of the canvas
    var videoElement = document.querySelector('video');
    if (videoElement) {
      videoElement.style['z-index'] = '200';
      // videoElement.style['transform'] = 'scale(-1,1)';
      // videoElement.style['filter'] = 'flipH';
      videoRepositioned = true;
    }
  }

  // use the markers as positional controllers
  if (markerHiro.isVisible() == true && lost == false) {
    // get the position of this marker
    var hiroPosition = markerHiro.getScreenPosition();

    // update the player position
    playerX = hiroPosition.x;
    playerY = hiroPosition.y;
  

    // draw all coins
    for (var i = 0; i < woodsprites.length; i++) {
      woodsprites[i].moveAndDisplay();
    }

    for (var i = 0; i < boulders.length; i++){
      boulders[i].moveAndDisplay();
    }

    // draw the player
    imageMode(CENTER);
    image(player, playerX, playerY);

    // draw points
    fill(255);
    textSize(15);
    text("Points: " + points, width/4, height/4);

    for (let i = 0; i < boulderCount; i++){
      image(eXX, 50+30*i,height/5);
    }
  }

  if(lost == true){
    // get the position of this marker
    var hiroPosition = markerHiro.getScreenPosition();

    gameOvX = hiroPosition.x;
    gameOvY = hiroPosition.y;

    imageMode(CENTER);
    image(gameOver, gameOvX, gameOvY);

    for (let i = 0; i < boulderCount; i++){
      image(eXX, 50+30*i,height/5);
    }

  }

  if(markerHiro.isVisible() == false){
    fill(255);
    textSize(50);
    textAlign(CENTER);
    text("Hiro Marker is Not Visible", width/2, height/2);

    fill(255);
    textSize(15);
    text("Points: " + points, width/4, height/4);

    for (let i = 0; i < boulderCount; i++){
      image(eXX, 50+30*i,height/5);
    }
  }
}

class woodSprite{
  constructor(){

  // position of woodsprites
  this.x = random(width);
  this.y = random(-500,0);
  this.randNum = int(random(0,1.5));
  this.noiseOffsetX = random(0,1000)

  this.speed = random(0.5,5);
  }

  //move the woodsprites using perlin noise
  moveAndDisplay() {
    this.y += this.speed;
    var xMovement = map(noise(this.noiseOffsetX), 0, 1, -2, 2);
    this.x += xMovement;
    if (dist(this.x, this.y, playerX, playerY) < 100) {
      points++;
      this.y = random(-500,0);
      this.x = random(width);
    }
    if (this.y > height) {
      this.y = random(-500,0);
      this.x = random(width);
    }
    fill(0,255,0);
    if(this.randNum == 0){
    	image(woodSprite1, this.x, this.y);
    }
    else{
    	image(woodSprite2, this.x, this.y);
    }
    this.noiseOffsetX +=.01;
    //ellipse(this.x, this.y, 25, 25);
  }
}

function mousePressed(){
  if (lost == true){
    lost = false
    boulderCount = 0
    points = 0
  }
}

class Boulder{
  constructor(){
    this.x = random(width);
    this.y = random(-500,0);
    this.noiseOffsetX = random(0,1000)

    this.speed = random(0.5,5);
  }

    //move the woodsprites using perlin noise
  moveAndDisplay() {
    this.y += this.speed;
    var xMovement = map(noise(this.noiseOffsetX), 0, 1, -2, 2);
    this.x += xMovement;
    if (dist(this.x, this.y, playerX, playerY) < 100) {
      boulderCount+=1;
      this.y = random(-500,0);
      this.x = random(width);
    }
    if (this.y > height) {
      this.y = random(-500,0);
      this.x = random(width);
    }

    if(boulderCount == 5){
      lost = true;
    }
    fill(0,255,0);
    image(boulder, this.x, this.y);
    this.noiseOffsetX +=.01;
    //ellipse(this.x, this.y, 25, 25);
  }
}




