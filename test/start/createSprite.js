Game.setBackdrop("./assets/background.png", 0, 0, 520, 390);

var bird = Game.createSprite("./assets/bird.png");
var tubeUp = Game.createSprite({
    costumes: "./assets/up-tube.png",
    x: 400,
  	y: -30
});
var tubeDown = Game.createSprite({
  	costumes: "./assets/down-tube.png",
	x: 400,
  	y: 430
});