var bird = Game.createSprite("./assets/bird.png");

Game.when("mousedown", function () {
    bird.scale += 1;
});