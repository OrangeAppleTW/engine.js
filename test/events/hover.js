var bird = Game.createSprite('assets/bird.png');

Game.when('hover', bird, function() {
    bird.scale = 3;
});