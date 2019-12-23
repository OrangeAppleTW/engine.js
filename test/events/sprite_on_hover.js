var bird = Game.createSprite('assets/bird.png');

bird.on('hover', function() {
    bird.scale += 0.05;
});