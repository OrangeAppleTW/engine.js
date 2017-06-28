var bird = Game.createSprite('assets/bird.png');

Game.when('keyup', 'space', function() {
    bird.scale += 0.5;
});