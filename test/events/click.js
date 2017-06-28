var bird = Game.createSprite('assets/bird.png');

Game.when('click', bird, function() {
    bird.scale = 3;
});