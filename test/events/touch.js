var bird_1 = Game.createSprite('assets/bird.png');
var bird_2 = Game.createSprite('assets/bird.png');

bird_2.x = 30;
bird_2.y = 30;
forever(function() {
    bird_2.moveTo(cursor);
});

Game.when('touch', [bird_1, bird_2], function() {
    bird_2.destroy();
});