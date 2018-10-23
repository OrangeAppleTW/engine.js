//== 為了找出 圓形範圍演算法的效能瓶頸

Game.setBackdrop("./assets/background.png", 0, 0, 520, 390);

var lowestFps = 999;
var avgFps = 0;
var then = (new Date()).getTime();
var fps = 0;

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

var bird = Game.createSprite("./assets/bird.png");
bird.forever(function(){
    this.x = Game.cursor.x;
    this.y = Game.cursor.y;
    for(let i=0; i<1000; i++){
        if(this.touched(tubeUp)){
            this.opacity=0.5;
        } else {
            this.opacity=1;
        }
    }
});

Game.forever(function() {
    var now = (new Date()).getTime();
    if(now-then>=500){
        fps = Game.inspector.fps;
        then = now;
    }
    Game.print("FPS: "+fps, 20, 20);
});
