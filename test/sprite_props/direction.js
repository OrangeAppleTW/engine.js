var bird = Game.createSprite("./assets/bird.png");

Game.forever(function() {
    bird.direction += 1;
    print(bird.direction, 10, 10, 'red', 60);
});