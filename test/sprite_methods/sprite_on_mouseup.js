var bird = Game.createSprite('assets/bird.png');

bird.when('mouseup', function() {
    bird.scale += 0.5;
});
