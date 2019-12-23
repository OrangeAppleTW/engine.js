
var b1 = Game.createSprite('./assets/bird.png');
var b2 = Game.createSprite('./assets/bird.png');
var b3 = Game.createSprite('./assets/bird.png');

b1.x = 300;
b2.x = 600;
b3.x = 900;

b1.rotationStyle = 'full';
b2.rotationStyle = 'flipped';
b3.rotationStyle = 'fixed';

Game.forever(function() {
    b1.toward(cursor);
    b2.toward(cursor);
    b3.toward(cursor);

    Game.print('full', 200, 300, 'red', 60);
    Game.print('flipped', 500, 300, 'red', 60);
    Game.print('fixed', 800, 300, 'red', 60);
});