var bird_1 = Game.createSprite({
    costumes: "./assets/bird.png",
    x: 100,
    y: 200,
    rotationStyle: 'full'
});

var bird_2 = Game.createSprite({
    costumes: "./assets/bird.png",
    x: 250,
    y: 200,
    rotationStyle: 'flipped'
});

var bird_3 = Game.createSprite({
    costumes: "./assets/bird.png",
    x: 400,
    y: 200,
    rotationStyle: 'fixed'
});

Game.forever(function() {
    bird_1.toward(Game.cursor);
    bird_2.toward(Game.cursor);
    bird_3.toward(Game.cursor);

    Game.print('full', 80, 230, 'red', 16);
    Game.print('flipped', 230, 230, 'red', 16);
    Game.print('fixed', 380, 230, 'red', 16);
});