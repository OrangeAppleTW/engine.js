var bird = createSprite("./assets/bird.png");

forever(function() {
    bird.direction += 1;
    print(bird.direction, 10, 10, 'red', 30);
});