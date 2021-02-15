// variable to hold a reference to our A-Frame world
//the boxes in the sky respond to user touch & they change color 
//tetrahedron and octahedron on ground change size when hover over 
// the sound plays when you hover over the boxes
var world;
var currentImage = 0;
var ring;
var waterArr = [];
var container; //for the composite object 
let hover;
var sprites = [];
var particles = [];
var floatingStones = [];

var planetContainer, planet
var userX, userY, userZ
var timeCount = 0

//variable to detect if trigger the flying feature
//1 for activated
var flyState = 0

function preload() {
	hover = loadSound('hover.wav');
	wind_snd = loadSound("sounds/wind.wav")
	wing_snd = loadSound("sounds/wing.wav")
}

function setup() {
	// no canvas needed
	noCanvas();

	// for (let i = 0; i < 5; i++){
	// 	sprites.push(new WoodSprites(1, .5, 2));
	// }

	// construct the A-Frame world
	// this function requires a reference to the ID of the 'a-scene' tag in our HTML document
	world = new World('VRScene');
	container = new Container3D({ x: 0, y: 1, z: -2 });
	world.add(container);

	userX = world.getUserPosition().x
	userY = world.getUserPosition().y
	userZ = world.getUserPosition().z

	dragon = new OBJ({
		asset: 'dragon_obj',
		mtl: 'dragon_mtl',
		x: 5,
		y: 1,
		z: 2,
		rotationX: 0,
		rotationY: 180,
		scaleX: 10,
		scaleY: 10,
		scaleZ: 10,

	});
	world.add(dragon);

	//add mountains
	var mountain = new OBJ({
		asset: 'mountain_obj',
		mtl: 'mountain_mtl',
		x: 0,
		y: 0,
		z: -140,
		scaleX: 30,
		scaleY: 50,
		scaleZ: 13
	})

	var mountainLeft = new OBJ({
		asset: 'mountain_obj',
		mtl: 'mountain_mtl',
		x: -140,
		y: 0,
		z: 0,
		rotationY: 90,
		scaleX: 30,
		scaleY: 30,
		scaleZ: 13
	})

	var mountainRight = new OBJ({
		asset: 'mountain_obj',
		mtl: 'mountain_mtl',
		x: 140,
		y: 0,
		z: 0,
		rotationY: -90,
		scaleX: 30,
		scaleY: 30,
		scaleZ: 13
	})

	var mountainBack = new OBJ({
		asset: 'mountain_obj',
		mtl: 'mountain_mtl',
		x: 0,
		y: 0,
		z: 300,
		rotationY: 180,
		scaleX: 30,
		scaleY: 50,
		scaleZ: 13
	})

	world.add(mountain)
	world.add(mountainLeft)
	world.add(mountainRight)
	world.add(mountainBack)

	// construct a new Container
	//this is for a planet
	planetContainer = new Container3D({ x: 0, y: 100, z: 0 })
	world.add(planetContainer)

	planet = new Sphere({
		x: 200,
		y: 200,
		z: -200,
		asset: "planet_img",
		rotationX: 60,
		radius: 150
	})

	var planetRing = new Ring({
		x: 200,
		y: 200,
		z: -200,
		asset: "ring_img",
		rotationX: 60,
		radiusInner: 160,
		radiusOuter: 200,
		side: "double"
	})

	planetContainer.add(planet)
	planetContainer.add(planetRing)

	purpletree = new OBJ({
		asset: 'purpletree_obj',
		mtl: 'purpletree_mtl',
		x: 0,
		y: 0,
		z: -50,
		rotationX: 0,
		rotationY: 180,
		scaleX: 5,
		scaleY: 5,
		scaleZ: 5
	});
	world.add(purpletree);

	var textHolder = new Plane({
		x: 0, y: 2, z: -45,
		width: 5,
		height: 1,
		red: 75,
		green: 0,
		blue: 130
	});
	world.add(textHolder)

	var backingPlane = new Plane({
		x: 0, y: 2, z: -45.1,
		width: 5, height: 1,
		red: 75, green: 0, blue: 130
	})
	world.add(backingPlane)

	textHolder.tag.setAttribute('text',
		'value: Tree of Souls; color: rgb(255,255,255); align: center;');

	for (var i = 0; i < 4; i++) {
		var scale = random(2, 4)
		tree = new OBJ({
			asset: 'tree_obj',
			mtl: 'tree_mtl',
			x: -50 + random(-10, 10),
			y: 0,
			z: 120 - 30 * i,
			rotationX: 0,
			rotationY: 180,
			scaleX: scale,
			scaleY: scale,
			scaleZ: scale,
		});
		world.add(tree);
	}

	for (var i = 0; i < 4; i++) {
		var scale = random(2, 4)
		tree = new OBJ({
			asset: 'tree_obj',
			mtl: 'tree_mtl',
			x: 50 + random(-10, 10),
			y: 0,
			z: 120 - 30 * i,
			rotationX: 0,
			rotationY: 180,
			scaleX: scale,
			scaleY: scale,
			scaleZ: scale
		});
		world.add(tree);
	}

	for (var i = 0; i < 30; i++) {
		bush = new OBJ({
			asset: 'bush_obj',
			mtl: 'bush_mtl',
			x: random(-50, 50),
			y: 0,
			z: random(-50, 50),
			rotationX: 0,
			rotationY: 180,
			scaleX: .1,
			scaleY: .1,
			scaleZ: .1
		});
		world.add(bush);
	}

	forest = new OBJ({
		asset: 'forest_obj',
		mtl: 'forest_mtl',
		x: 50,
		y: 5,
		z: -3,
		rotationX: 0,
		rotationY: 180,
		scaleX: 20,
		scaleY: 20,
		scaleZ: 20
	});

	forest2 = new OBJ({
		asset: 'forest_obj',
		mtl: 'forest_mtl',
		x: -50,
		y: 5,
		z: -3,
		rotationX: 0,
		rotationY: 180,
		scaleX: 20,
		scaleY: 20,
		scaleZ: 20
	});

	world.add(forest);
	world.add(forest2);


	// //shape 1 - box 
	// for (var i = 0; i < 60; i++) {
	// 	// pick a location
	// 	var x = random(-50, 50);
	// 	var y = 10;
	// 	var z = random(-50, 50);

	// 	var currBox = new Box({
	// 		x: x,
	// 		y: y,
	// 		z: z,
	// 		red: random(40, 100), green: random(255), blue: random(0, 100),
	// 		asset: 'bark',
	// 		//responds to touch 
	// 		clickFunction: function (b) { //responds to users touch
	// 			// update color
	// 			b.setColor(random(40, 255), random(255), random(0, 100));

	// 			// teleport the user here immediately
	// 			// world.teleportToObject( b );
	// 		}
	// 	});

	// 	// add the box to the world
	// 	world.add(currBox);
	// }
	//construct a new ring - shape 2
	ring = new Ring({ x: 0, y: 3, z: -2, radiusInner: 0.5, radiusOuter: 1, red: 255, green: 255, blue: 0, side: "double" });

	//add the ring to the world
	container.addChild(ring);

	//add a sphere in center of ring
	var centSphere = new Sphere({ x: 0, y: 3, z: -2, radius: .3, red: 255, green: 255, blue: 0 });
	container.addChild(centSphere);

	// //shape 3 - sphere
	// for (var i = 0; i < 50; i++) {
	// 	var sphere = new Sphere({ x: random(-50, 50), y: 4, z: random(-50, 50), asset: "bark", red: random(40, 100), green: 255, blue: random(0, 100), radius: .2 });

	// 	// add the sphere to the world
	// 	world.add(sphere);
	// }

	//add stones to the world
	for (var i = 0; i < 5; i++) {
		var tetrahedron = new Tetrahedron({
			x: random(-50, 50), y: .5, z: random(-50, -55), asset: "stone", red: 230, green: 230, blue: 230,
			scaleX: 3, scaleY: 3, scaleZ: 3,

			enterFunction: function (me) {
				me.setScale(3.5, 3.5, 3.5);
				hover.play();
			},
			leaveFunction: function (me) {
				me.setScale(3, 3, 3);
			}
		});
		world.add(tetrahedron);
	}

	for (var i = 0; i < 5; i++) {
		var tetrahedron = new Tetrahedron({
			x: random(-50, -55), y: .5, z: random(-50, 50), asset: "stone", red: 230, green: 230, blue: 230,
			scaleX: 3, scaleY: 3, scaleZ: 3,

			enterFunction: function (me) {
				me.setScale(3.5, 3.5, 3.5);
				hover.play();
			},
			leaveFunction: function (me) {
				me.setScale(3, 3, 3);
			}
		});
		world.add(tetrahedron);
	}

	for (var i = 0; i < 5; i++) {
		var tetrahedron = new Tetrahedron({
			x: random(50, 55), y: .5, z: random(-50, 50), asset: "stone", red: 230, green: 230, blue: 230,
			scaleX: 3, scaleY: 3, scaleZ: 3,

			enterFunction: function (me) {
				me.setScale(3.5, 3.5, 3.5);
				hover.play();
			},
			leaveFunction: function (me) {
				me.setScale(3, 3, 3);
			}
		});
		world.add(tetrahedron);
	}

	//add floating stones
	for (var i = 0; i < 5; i++) {
		floatingStones.push(new FloatingStone)
	}

	// //shape 5 octahedron
	// for (var i = 0; i < 10; i++) {
	// 	var octahedron = new Octahedron({
	// 		x: random(-140, -170), y: .5, z: random(-50, 50), asset: "stone", red: 240, green: 240, blue: 24,

	// 		enterFunction: function (me) {
	// 			me.setScale(1.5, 1.5, 1.5);
	// 			hover.play();
	// 		},
	// 		leaveFunction: function (me) {
	// 			me.setScale(1, 1, 1);
	// 		}

	// 	});
	// 	world.add(octahedron);
	// }

	var g = new Plane({
		x: 0, y: 0, z: 0,
		width: 500, height: 500,
		repeatX: 100,
		repeatY: 100,
		rotationX: -90, metalness: 0.25,
		asset: 'water_img'
	});

	// add the plane to our world
	world.add(g);

	for (var i = 0; i < 50; i++) {
		let temp = new Waterfall(random(-10, -5), random(0, 50), -20)
		waterArr.push(temp)
	}
	var pointLight = new Light({
		x: 0, y: 5, z: 2,
		color: '#fff',
		type: 'point',
		intensity: 1.0
	})
	//world.add(pointLight)

}

function draw() {
	userX = world.getUserPosition().x
	userY = world.getUserPosition().y
	userZ = world.getUserPosition().z

	if (flyState == 0) {
		dragon.setPosition(5, 1, 2)
		dragon.rotateY(180)
		if (dist(userX, userY, userZ, dragon.getX(), dragon.getY(), dragon.getZ()) <= 3) {
			flyState = 1
		}

		if (mouseIsPressed) {
			world.moveUserForward(.1);
		}
	}

	//flyingmode
	if (flyState == 1) {
		dragon.rotateY(110)

		timeCount += 1

		if (timeCount <= 1) {
			world.setUserPosition(0, 1, 150)
			userX = 0
			userY = 1
			userZ = 150
		}
		else if (timeCount > 1 && timeCount <= 100) {
			userZ -= 0.02
		} else if (timeCount <= 150) {
			//wing_snd.play()
			userZ -= 0.1
			userY += 0.5
			dragon.spinX(-0.2)
		} else if (timeCount <= 300) {
			//wing_snd.play()
			userZ -= 0.1
			userY += 0.5
		} else if (timeCount <= 350) {
			//wing_snd.play()
			userZ -= 0.1
			userX -= 0.05
			dragon.spinX(0.2)
			dragon.spinY(0.2)
		} else if (timeCount <= 500) {
			userZ -= 0.1
			userX -= 0.05
		} else if (timeCount <= 550) {
			userZ -= 0.1
			userY += 0.5
			dragon.spinX(-0.2)
			dragon.spinY(-0.2)
		} else if (timeCount <= 700) {
			userZ -= 0.1
			userY += 0.5
		} else if (timeCount <= 750) {
			dragon.spinX(0.4)
		} else if (timeCount <= 850) {
			userZ -= 0.5
			userY -= 2
		} else if (timeCount <= 900) {
			dragon.spinX(-0.2)
			userZ -= 0.5
		} else if (timeCount <= 950) {
			userZ -= 0.7
		} else {
			world.setUserPosition(0, 1, -5)
			userX = 0
			userY = 1
			userZ = -5
			flyState = 0
		}

		world.setUserPosition(userX, userY, userZ)
		dragon.setPosition(userX, userY - 1.2, userZ + 0.2)
	}

	//spin the planet
	planetContainer.spinY(0.5)
	planet.spinX(0.1)
	planet.spinY(0.1)

	var temp = new WoodSprites(0, .5, -50);

	sprites.push(temp);

	temp.move();

	// draw all particles
	for (let i = 0; i < sprites.length; i++) {
		var result = sprites[i].move();
		if (result == "gone") {
			sprites.splice(i, 1);
			i -= 1;
		}
	}

	for (let i = 0; i < waterArr.length; i++) {
		waterArr[i].move();
	}

	for (var i = 0; i < floatingStones.length; i++) {
		floatingStones[i].move()
	}

	//ring.spinX(1)

}


class Waterfall {
	constructor(x, y, z) {
		this.lilCubes = []
		for (var i = 0; i < 8; i++) {
			this.lilCubes.push(new Box({
				// asset: 'rain_obj',
				// mtl: 'rain_mtl',
				x: x + random(-5, 5), //shift from point added
				y: y,
				z: z,
				// scaleX: 2,
				// scaleY: 2,
				// scaleZ: 2,
				red: 0,
				green: 0,
				blue: random(0, 255),
				width: .25,
				height: .25,
				depth: .25

			}));
			world.add(this.lilCubes[i])
		}
		this.mySpeed = random(-.05, -.1);
	}

	move() {
		for (var i = 0; i < 8; i++) {
			this.lilCubes[i].nudge(0, this.mySpeed, 0)
			if (this.lilCubes[i].getY() < 0) {
				this.lilCubes[i].setY(50)
			}
		}
	}
}

class WoodSprites {
	constructor(x, y, z) {
		this.randint = int(random(0, 1.5));
		// construct a new tetrahedron that lives at this position - to resemble the woodsprites
		if (this.randint == 0) {
			this.currSprite = new Tetrahedron({
				x: x, y: y, z: z, width: .01, height: .01, depth: .01, asset: 'sprite', opacity: random(0, 0.8)
			});
		}
		else {
			this.currSprite = new Tetrahedron({
				x: x, y: y, z: z, width: .01, height: .01, depth: .01, asset: 'purpleSprite', opacity: random(0, .8)
			});
		}

		world.add(this.currSprite);
		this.xOffset = random(1000);
		this.yOffset = random(1000, 2000);
		this.zOffset = random(2000, 3000);
	}
	move() {
		// compute how the particle should move
		// the particle should always move up by a small amount

		// the particle should randomly move in the x & z directions
		var xMovement = map(noise(this.xOffset), 0, 1, -0.3, 0.3);
		var yMovement = 0.1 + map(noise(this.yOffset), 0, 1, -0.01, 0.01);
		var zMovement = map(noise(this.zOffset), 0, 1, -0.3, 0.3);

		// update our poistions in perlin noise space
		this.xOffset += 0.01;
		this.yOffset += 0.01;
		this.zOffset += 0.01;

		// set the position of our box (using the 'nudge' method)
		this.currSprite.nudge(xMovement, yMovement, zMovement);

		// make the boxes shrink a little bit
		var currScale = this.currSprite.getScale();
		this.currSprite.setScale(currScale.x - 0.001, currScale.y - 0.001, currScale.z - 0.001);

		// if we get too small we need to indicate that this box is now no longer viable
		if (currScale.x <= 0) {
			// remove the box from the world
			world.remove(this.currSprite);
			return "gone";
		}
		else {
			return "ok";
		}
	}
}

class FloatingStone {
	constructor() {
		this.y = random(100, 120)
		this.x = random(-100, 100)
		this.z = random(-100, 200)
		//floating stone
		this.floatingIsland = new OBJ({
			asset: 'island_obj',
			mtl: 'island_mtl',
			x: this.x,
			y: this.y,
			z: this.z,
			scaleX: 0.5,
			scaleY: 0.5,
			scaleZ: 0.5
		});

		world.add(this.floatingIsland)

		this.yOffset = random(1000)
	}

	move() {
		//the stones should floating up and down

		this.yMovement = map(noise(this.yOffset), 0, 1, -5, 5);

		// update our poistions in perlin noise space
		this.yOffset += 0.01;

		// set the position of our box (using the 'nudge' method)
		this.floatingIsland.setY(this.y + this.yMovement)

	}
}

