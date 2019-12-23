var bird_1 = createSprite("./assets/bird.png");
var bird_2 = createSprite("./assets/bird_2.png");

forever(function() {
    bird_1.moveTo(cursor);
    print(bird_1.touched(bird_2), 200, 100, 'red', 50);
});