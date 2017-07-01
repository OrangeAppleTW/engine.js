var bird = Game.createSprite("./assets/bird.png");

Game.when("mouseup", function () {
    bird.scale += 1;
});