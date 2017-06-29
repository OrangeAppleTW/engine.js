var bird = Game.createSprite("./assets/bird.png");

bird.forever(function() {
    this.stepForward(1);
});