var bird = Game.createSprite({
    costumes: "./assets/bird.png",
    x: 30,
    y: 30
});

Game.forever(function() {
    bird.x += 1;
    bird.y += 1;
});