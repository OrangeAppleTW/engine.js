var bird = Game.createSprite({
    costumes: "./assets/bird.png",
    x: 10,
    y: 10
});

Game.forever(function() {
    bird.move(1, 1);
});