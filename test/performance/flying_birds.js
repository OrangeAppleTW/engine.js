Game.setBackdrop("./assets/background.jpg");

var lowestFps = 999;
var avgFps = 0;
var timer = 0;

var pipes = Game.createSprite('./assets/pipe.png');
pipes.scale = 3;


for (var i = 0; i < 500; i++) {
    var bird = Game.createSprite("./assets/bird.png");
    bird.x = Math.random() * 1200;
    bird.y = Math.random() * 900;
    bird.forever(function () {
        this.opacity = this.touched(pipes) ? 0.2 : 1;
    });
}

Game.forever(function () {
    if (timer > 100) {
        if (Game.inspector.fps < lowestFps) {
            lowestFps = Game.inspector.fps;
        }
        Game.print("Lowest FPS: " + lowestFps, 20, 50, 'black', 50);
    }
    avgFps = (avgFps * timer + Game.inspector.fps) / (timer + 1)
    Game.print("Avg FPS: " + avgFps, 20, 10, 'black', 50);
    timer++;

    pipes.x -= 2;
    if (pipes.x < 0) pipes.x += 1200;

});
