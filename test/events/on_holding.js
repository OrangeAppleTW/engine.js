var bird = Game.createSprite('assets/bird.png');

Game.on('holding', function() {
    bird.direction += 3;
});