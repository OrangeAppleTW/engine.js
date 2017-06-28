var bird = Game.createSprite('assets/bird.png');

Game.when('keydown', 'space', function() {
    bird.scale += 0.5;
});