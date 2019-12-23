var bird_1 = createSprite("./assets/bird.png");
var bird_2 = createSprite("./assets/bird.png");

forever(function() {
    bird_1.moveTo(cursor);
    print(bird_1.distanceTo(bird_2), 10, 10, 'red', 30);
});