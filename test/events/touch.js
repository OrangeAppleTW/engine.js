var bird_1 = Game.createSprite('assets/bird.png');
var bird_2 = Game.createSprite('assets/bird_2.png');
bird_2.x = 0;

Game.forever(function() {
    bird_2.moveTo(Game.cursor);
});

bird_2.when("touch", bird_1, function () {
    bird_1.destroy();
});