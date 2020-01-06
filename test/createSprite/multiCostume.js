var a = Game.createSprite('./assets/bird_1.png', './assets/bird_2.png', './assets/bird_3.png');
var b = Game.createSprite(['./assets/bird_1.png', './assets/bird_2.png', './assets/bird_3.png']);

a.x -= 50;
b.x += 50;

forever(a.nextCostume.bind(a));
forever(b.nextCostume.bind(b));

