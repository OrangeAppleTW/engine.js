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

var bgm = Game.sound.play('./assets/bgm.ogg');
bgm.loop = true;

var vy = 0;
Game.forever(function() {
    tubeUp.x -= 2;
    tubeDown.x -= 2;
    if(tubeUp.x < 0) {
        resetTube();
    }
    bird.y += vy;
    vy += 0.2;
});

Game.when('click', function() { 
    vy = -5; 
    Game.sound.play('./assets/jump.ogg');
});
bird.when('touch', [tubeUp, tubeDown], function() {
    Game.stop();
});

function resetTube () {
    var pos = Math.random()*300 + 50;
    tubeUp.x = 450;
    tubeDown.x = 450;
    tubeUp.y = pos - 230;
    tubeDown.y = pos + 230;
}