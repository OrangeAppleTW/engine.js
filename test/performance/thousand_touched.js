Game.setBackdrop("./assets/background.jpg");

var lowestFps = 999;
var avgFps = 0;
var then = (new Date()).getTime();
var fps = 0;

var pipes = Game.createSprite("./assets/pipes.png");
var bird = Game.createSprite("./assets/bird.png");

bird.forever(function(){
    this.x = Game.cursor.x;
    this.y = Game.cursor.y;
    for(let i=0; i<1000; i++){
        if(this.touched(pipes)){
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
    Game.print("FPS: "+fps, 20, 20, '#fff', 50);
});
