var bird = createSprite('./assets/bird.png');
bird.x = 0;
bird.y = 0;

forever(function() {
    bird.move(5, 2);
});