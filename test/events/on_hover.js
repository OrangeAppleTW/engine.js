var bird = Game.createSprite('assets/bird.png');

Game.on('hover', bird, function() {
    bird.scale += 0.03;
});