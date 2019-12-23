var bird = createSprite("./assets/bird.png");

forever(function() {
    bird.stepForward(3);
    bird.direction += 1;
});