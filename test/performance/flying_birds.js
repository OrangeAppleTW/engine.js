Game.setBackdrop("./assets/background.png", 0, 0, 520, 390);

var lowestFps = 999;
var avgFps = 0;
var timer = 0;

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

for (var i=0; i<500; i++) {
    var bird = Game.createSprite("./assets/bird.png");
    bird.x = Math.random()*640;
    bird.y = Math.random()*480;
    bird.forever(function(){
        if(this.touched( [tubeUp, tubeDown] )){
            this.opacity = 0.5;
        } else {
            this.opacity = 1;
        }
    });
}

Game.forever(function() {
    if(timer>100){
        if (Game.inspector.fps<lowestFps) {lowestFps = Game.inspector.fps;}
        Game.print("Lowest FPS: "+lowestFps, 400, 20);
    }
    avgFps = (avgFps*timer + Game.inspector.fps)/(timer+1)
    Game.print("Avg FPS: "+avgFps, 20, 20);
    tubeUp.x -= 2;
    tubeDown.x -= 2;
    if(tubeUp.x < -30) {
        resetTube();
    } 
    timer++;
});

function resetTube () {
    var pos = Math.random()*300 + 50;
    tubeUp.x = 450;
    tubeDown.x = 450;
    tubeUp.y = pos - 230;
    tubeDown.y = pos + 230;
}