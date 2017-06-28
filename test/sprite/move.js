var bird = createSprite({
    costumes: "./assets/bird.png",
    x: 10,
    y: 10
});

forever(function() {
    bird.move(1, 1);
});