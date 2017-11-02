var bird_1 = Game.createSprite("./assets/bird.png");
var bird_2 = Game.createSprite("./assets/bird.png");

Game.forever(function () {
    for(var i=0; i<50; i++) {
        isTouched = bird_1.touched(bird_2);
    }
    Game.print(Game.inspector.fps);
});
