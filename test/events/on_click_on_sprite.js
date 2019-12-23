var bird = Game.createSprite('assets/bird.png');

Game.on('click', bird, function() {
    bird.scale += 0.5;
});