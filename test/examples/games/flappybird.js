Game.setBackdrop("/test/assets/background.png", 0, 0, 520, 390);

var bird = Game.createSprite("/test/assets/bird.png");
var tubeUp = Game.createSprite({
    costumes: "/test/assets/up-tube.png",
    x: 400,
  	y: -30
});
var tubeDown = Game.createSprite({
  	costumes: "/test/assets/down-tube.png",
	x: 400,
  	y: 430
});
var startBtn = Game.createSprite("/test/assets/start-button.png");
var gameOverLogo = Game.createSprite({
    costumes: "/test/assets/gameover.png",
    hidden: true,
    y: 100
});

var bgm = Game.sound.play('/test/assets/bgm.ogg');
bgm.loop = true;

var vy = 0;
var scores = 0;
var flying = false;
Game.forever(function() {
    if(!flying) {
        return;
    }
    tubeUp.x -= 2;
    tubeDown.x -= 2;
    if(tubeUp.x < 0) {
        resetTube();
        scores += 1;
    }
    bird.y += vy;
    vy += 0.2;
    Game.print(scores, 10, 10, 'white', 45);
    if(bird.y > 400 || bird.y < 0) {
        gameOver();
    }
});

Game.when('click', function() { 
    vy = -5;
    Game.sound.play('/test/assets/jump.ogg');
});
bird.when('touch', [tubeUp, tubeDown], gameOver);
startBtn.when('click', start);

function resetTube () {
    var pos = Math.random()*300 + 50;
    tubeUp.x = 450;
    tubeDown.x = 450;
    tubeUp.y = pos - 230;
    tubeDown.y = pos + 230;
}
function start () {
  	startBtn.hidden = true;
    gameOverLogo.hidden = true;
    bird.y = 200;
    scores = 0;
    flying = true;
    tubeUp.x = 450;
    tubeDown.x = 450;
}
function gameOver () {
    gameOverLogo.hidden = false;
    startBtn.hidden = false;
    flying = false;
}