var bird = Game.createSprite('./assets/bird.png');

Game.when('mouseup', bird, function () {
    bird.scale += 1;
});

