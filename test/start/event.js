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

when('click', function() { vy = -5; });
bird.when('touch', [tubeUp, tubeDown], gameOver);

var vy = 0;
forever(function() {
    tubeUp.x -= 2;
    tubeDown.x -= 2;
    if(tubeUp.x < 0) {
        resetTube();
    }
    bird.y += vy;
    vy += 0.2;
});

function resetTube () {
    var pos = Math.random()*300 + 50;
    tubeUp.x = 450;
    tubeDown.x = 450;
    tubeUp.y = pos - 230;
    tubeDown.y = pos + 230;
}

function gameOver () {
    startBtn.hidden = false;
	status = 'gameOver';
}