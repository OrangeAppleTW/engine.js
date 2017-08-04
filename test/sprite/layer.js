var bird_1 = Game.createSprite({
    costumes: "./assets/bird.png",
    x: 100,
    y: 200,
    layer: 1
});

var bird_2 = Game.createSprite({
    costumes: "./assets/bird_2.png",
    x: 250,
    y: 200,
    layer: 2
});

var bird_3 = Game.createSprite({
    costumes: "./assets/bird.png",
    x: 400,
    y: 200,
    layer: 3
});

Game.forever(function() {
    bird_2.moveTo(Game.cursor);
});