var bird = Game.createSprite('assets/bird.png');


bird.when('touch', Game.cursor, function () {
    bird.x = Math.random()*1200;
    bird.y = Math.random()*900;
});