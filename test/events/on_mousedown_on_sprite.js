var bird = Game.createSprite('./assets/bird.png');

Game.when('mousedown', bird, function () {
    bird.scale += 1;
});

