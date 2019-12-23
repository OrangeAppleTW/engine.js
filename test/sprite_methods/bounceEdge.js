var bird = createSprite("./assets/bird.png");
bird.direction = 30;

bird.forever(function() {
    this.stepForward(5);
    this.bounceEdge();
});