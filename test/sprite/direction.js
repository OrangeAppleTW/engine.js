var bird = Game.createSprite("./assets/bird.png");

Game.forever(function() {
    bird.direction += 1;
    Game.print(bird.direction, 10, 10, 'red', 30);
});