var bird = Game.createSprite("assets/bird.png");

Game.when("keyup", function() {
    bird.scale += 0.5;
});