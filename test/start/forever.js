setBackdrop("./assets/background.png", 0, 0, 470, 400);

var bird = createSprite("./assets/bird.png");
var tubeUp = createSprite({
    costumes: "./assets/up-tube.png",
    x: 450,
  	y: -30
});
var tubeDown = createSprite({
  	costumes: "./assets/down-tube.png",
	x: 450,
  	y: 430
});

forever(function() {
    tubeUp.x -= 2;
    tubeDown.x -= 2;
    if(tubeUp.x < 0) {
        resetTube();
    } 
});

function resetTube () {
    var pos = Math.random()*300 + 50;
    tubeUp.x = 450;
    tubeDown.x = 450;
    tubeUp.y = pos - 230;
    tubeDown.y = pos + 230;
}