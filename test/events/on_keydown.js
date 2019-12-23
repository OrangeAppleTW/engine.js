var bird = Game.createSprite("assets/bird.png");

Game.when("keydown", function() {
    bird.scale += 0.2;
});