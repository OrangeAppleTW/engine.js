
var b1 = Game.createSprite('./assets/bird.png');
var b2 = Game.createSprite('./assets/bird.png');
var b3 = Game.createSprite('./assets/bird.png');

b1.x = 300;
b2.x = 600;
b3.x = 900;

b1.layer = 0;
b2.layer = 1;
b3.layer = 2;

Game.forever(function() {
    b2.moveTo(cursor);
});