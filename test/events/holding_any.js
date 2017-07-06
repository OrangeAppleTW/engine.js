var bird = Game.createSprite("assets/bird.png");

Game.when("holding", function() {
    bird.direction += 3;
});