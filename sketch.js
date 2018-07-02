var loc;
var vel;
var grav;
var amp;
var music;
var mudBalls;
var loudness;
var player1;
var endGameScreen;
var backGroundPiggies;
var mudAvoided;

function setup() {
	textAlign(CENTER);
	//array of mudballs 
	mudBalls = [];
	endGameScreen = false;
	//creating format for images in the code 
	imageMode(CENTER, CENTER);
	player1 = loadImage("man.png");
	backGroundPiggies = loadImage("pig.png");
	//simulating motion for the playerModel 
	vel = createVector(0, 5);
	grav = createVector(0, 1);
	loc = createVector(width / 7, height / 1.2);
	//score 
	mudAvoided = 0;
	//sound code
	amp = new p5.Amplitude();
	amp.setInput(music);
	//creating number of mud balls in the code 
	for (var e = 0; e < 3; e++) {
		mudBalls[e] = new mudPellet();
	}
	//setting input sound 
	level = new p5.Amplitude();
	level.setInput(music);
	music.loop();
	createCanvas(windowWidth, windowHeight);
}

function keyTyped() {
	if (key === 'R' || key === 'r' && endGameScreen === true) {
		music.stop();
		setup();
		draw();
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function preload() {
	//loading sound 
	music = loadSound('mud.wav');
}

function draw() {
	loudness = amp.getLevel();
	console.log(loudness);
	//if statement that states whether you're in the game or you've lost based on the object detection with the mudballs 
	if (endGameScreen === false) {
		playGame();
		text(" " + mudAvoided + " ", width / 2, height / 8)
		image(backGroundPiggies, width / 7, height / 1.2, width / 9, height / 7);
		image(backGroundPiggies, width / 2, height / 1.2, width / 9, height / 7);
		image(backGroundPiggies, width / 1.3, height / 1.2, width / 9, height / 7);
	} else if (endGameScreen === true) {
		endGame();
	}
}

function keyPressed() {
	//determines movement of playerModel with his vectors 
	if (keyIsDown(RIGHT_ARROW)) {
		vel.x = 9;
	} else if (keyIsDown(LEFT_ARROW)) {
		vel.x = -9;
	} else if (keyIsDown(DOWN_ARROW)) {
		vel.x = 0;
		vel.y = 0;
	}
	//jump height remains constant only when hes grounded 
	if (keyIsDown(UP_ARROW) && (loc.y == height / 1.65)) {
		vel.y = height / -32;
	}
}

function playerModel() {
	//physics sim 
	loc.add(vel);
	vel.add(grav);
	//prevents bouncing from the player 
	if (loc.y >= height / 1.65) {
		vel.y = vel.y * -0.5;
		if (abs(vel.y) < 100) {
			vel.y = 0;
		}
		loc.y = height / 1.65;
	}
	fill(127);
	noStroke();
	image(player1, loc.x, loc.y, width / 20, height / 6);
	//stops player from sliding off the screen 
	if (loc.x > width || loc.x < 0) {
		vel.x = 0;
	}
}

function endGame() { //screen of the player stuck in the middle of the mud
	//must restart to replay the game 
	//what shows up when the player loses the game 
	noStroke();
	//background code 
	background(0, 183, 252);
	fill(118, 59, 59);
	rect(0, height / 1.2, width, height);
	for (var i = 0; i < width; i += width / 20) {
		fill(255);
		stroke(255);
		rect(i, height / 1.45, width / 80, height / 7);
	}
	rect(0, height / 1.44, width, height / 40);
	rect(0, height / 1.33, width, height / 40);
	stroke(0);
	//final portion where character stuck in mud after failing to dodge mud 
	textSize(30);
	text("Oh no! You got stuck in the mud! Hit the key R to restart! You avoided " + mudAvoided + " mud balls.", width / 9, height / 2);

	image(player1, width / 2, height / 1.2, width / 20, height / 6);


}

function playGame() {
	//assigning loudness to a variable related to amplitude of sound 

	noStroke();
	//background code 
	background(0, 183, 252);
	fill(118, 59, 59);
	rect(0, height / 1.2, width, height);
	for (var i = 0; i < width; i += width / 20) {
		fill(255);
		stroke(255);
		rect(i, height / 1.45, width / 80, height / 7);
	}
	rect(0, height / 1.44, width, height / 40);
	rect(0, height / 1.33, width, height / 40);
	stroke(0);
	//instructions being displayed at the bottom of the screen 
	textSize(15);
	text("The goal of this game is to avoid the mud balls that are coming towards your character.", width / 1.8, height / 1.07);
	text("Use the RIGHT and LEFT arrow keys to move, use the DOWN arrow key to stand still and use the UP arrow key to jump.", width / 11, height / 1.07);
	//creating the playerModel on the screen which moves 
	playerModel();
	//making the mudBalls  appear and move 
	for (var ii = 0; ii < mudBalls.length; ii++) {
		mudBalls[ii].move();
		mudBalls[ii].show();
	}
}
//creates the object of the mudball that goes towards the player 
function mudPellet() {
	this.xpos = random(width, width + 800);
	this.ypos = random(0, height / 1.5);
	this.speed = 1;
	this.xpos -= this.speed;
	this.move = function() {
		this.speed = random(loudness * 100, 15);
		if (this.xpos < 0) {
			this.xpos = random(width, width + 800);
			this.ypos = random(0, height / 1.5);
			//counter for mud avoided 
			mudAvoided++;
		}
		this.xpos -= this.speed;
	}
	this.show = function() {
		fill(118, 59, 59);
		ellipse(this.xpos, this.ypos, 20, 20);
		//if the distance between the player and the object is less than this then go to end screen 
		if (dist(loc.x, loc.y, this.xpos, this.ypos) <= player1.height / 10 + 10) {
			endGameScreen = true;
		}
	}
}