var bird = Game.createSprite('assets/bird.png');

Game.on('click', function() {
    bird.scale += 0.5;
});