var bird = Game.createSprite("./assets/bird.png");

Game.forever(function() {
    bird.stepForward(1);
    bird.direction += 1;
});