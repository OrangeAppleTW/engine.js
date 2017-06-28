var bird = createSprite("./assets/bird.png");

bird.forever(function() {
    this.stepForward(1);
    this.direction += 1;
});