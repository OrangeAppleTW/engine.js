var bird = Game.createSprite('assets/bird.png');

bird.when('click', function() {
    bird.scale += 0.5;
});
