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
var startBtn = createSprite("./assets/start-button.png");
var gameOverLogo = createSprite({
    costumes: "./assets/gameOver.png",
    hidden: true,
    y: 100
});

var scores = 0;
var vy = 0;

when('click', function() { vy = -5; });
startBtn.when('click', start);
bird.when('touch', [tubeUp, tubeDown], gameOver);

forever(function() {
  	if(status == 'start') {
      tubeUp.x -= 2;
      tubeDown.x -= 2;
      if(tubeUp.x < 0) {
          randomPos();
          scores += 1;
      } 
      vy += 0.2;
      bird.y += vy;
    }
    print(scores, 10, 10, 'red', 45);
    if(bird.y > 400 || bird.y < 0) gameOver();
});

function start () {
  	startBtn.hidden = true;
    gameOverLogo.hidden = true;
  	status = 'start';
    bird.y = 200;
    scores = 0;
    randomPos();
}
function randomPos () {
    var pos = Math.random()*300 + 50;
    tubeUp.x = 450;
    tubeDown.x = 450;
    tubeUp.y = pos - 230;
    tubeDown.y = pos + 230;
}
function gameOver () {
    gameOverLogo.hidden = false;
    startBtn.hidden = false;
	status = 'gameOver';
}