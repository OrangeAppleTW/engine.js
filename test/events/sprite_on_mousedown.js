var bird = Game.createSprite('./assets/bird.png');

bird.when('mousedown', function () {
    bird.scale += 1;
});