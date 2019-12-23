var bird = Game.createSprite('./assets/bird.png');
bird.x = 300;
bird.y = 300;

forever(function() {
    bird.x += 1;
    bird.y += 1;
});