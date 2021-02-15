// create a variable to hold our world object
var world;
var planet, planetContainer
var particleContainer
var particles = []

// create variables to hold our markers
var markerHiro, markerZb;

// logic for flipping the incoming video feed
var videoRepositioned = false

function setup() {
    // create our world (this also creates a p5 canvas for us)
    world = new World('ARScene');

    // grab a reference to our two markers that we set up on the HTML side (connect to it using its 'id')
    markerHiro = world.getMarker('hiro');
    markerZb = world.getMarker('zb');

    // create some geometry to add to our marker
    // the marker is 1 meter x 1 meter, with the origin at the center
    // the x-axis runs left and right
    // -0.5, 0, -0.5 is the top left corner

    var dragon = new OBJ({
        asset: 'blueDragon_obj',
        mtl: 'robot_mtl',
        x: 0,
        y: 0.25,
        z: 0,
        rotationX: -90,
        scaleX: 0.02,
        scaleY: 0.02,
        scaleZ: 0.02
    })
    markerHiro.addChild(dragon)

    planetContainer = new Container3D({ x: 0, y: 0, z: 0 })
    particleContainer = new Container3D({ x: 0, y: 0, z: 0 })

    planet = new Sphere({
        x: 1,
        y: 0,
        z: 0,
        asset: "planet_img",
        rotationX: 60,
        radius: 0.5
    })

    var planetRing = new Ring({
        x: 1,
        y: 0,
        z: 0,
        asset: "ring_img",
        rotationX: 60,
        radiusInner: 0.6,
        radiusOuter: 0.7,
        side: "double"
    })

    planetContainer.addChild(planet)
    planetContainer.addChild(planetRing)

    markerZb.addChild(planetContainer)

    for (var i = 0; i < 80; i++) {
        particles.push(new Particle())
    }

    world.scene.appendChild(particleContainer.tag)
}


function draw() {

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

    //console.log(displayWidth)

    //spin the planet
    planetContainer.spinY(0.5)
    planet.spinX(0.1)
    planet.spinY(0.1)

    // draw all particles
    for (var i = 0; i < particles.length; i++) {
        particles[i].move()
    }

    if (markerZb.isVisible() == true) {
        particleContainer.show()
    } else {
        particleContainer.hide()
    }

}


class Particle {

    constructor() {
        // construct a new Box that lives at this position
        this.myBox = new Sphere({
            x: random(-2, 2),
            y: random(-2, 2),
            z: random(-10, 3),
            radius: random(0.05, 0.1),
            asset: "dust_img",
            opacity: random(0.8, 1)
        });

        // add the box to level2
        particleContainer.addChild(this.myBox);
        //console.log("add")

        // keep track of an offset in Perlin noise space
        this.xOffset = random(1000);
        this.yOffset = random(1000);
        this.zOffset = random(2000, 3000);
    }

    // function to move our box
    move() {
        // compute how the particle should move

        // the particle should randomly move in the x & z directions
        var xMovement = map(noise(this.xOffset), 0, 1, -0.01, 0.01);
        var yMovement = map(noise(this.yOffset), 0, 1, -0.01, 0.01);
        var zMovement = map(noise(this.zOffset), 0, 1, -0.01, 0.01);

        // update our poistions in perlin noise space
        this.xOffset += 0.01;
        this.yOffset += 0.01;

        // set the position of our box (using the 'nudge' method)
        this.myBox.nudge(xMovement, yMovement, zMovement);
    }
}
