var bird = Game.createSprite('assets/bird.png');

Game.when('touch', bird, Game.cursor, function() {
    bird.x = Math.random()*1200;
    bird.y = Math.random()*900;
});
