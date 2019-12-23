var bird_1 = Game.createSprite('assets/bird.png');
var bird_2 = Game.createSprite('assets/bird.png');

Game.forever(function() {
    bird_1.moveTo(Game.cursor);
});

bird_1.when('touch', bird_2, function () {
    bird_2.x = Math.random()*1200;
    bird_2.y = Math.random()*900;
});