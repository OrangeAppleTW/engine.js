var bird = createSprite({
    costumes: "./assets/bird.png",
    x: 100,
    y: 100
});

forever(function() {
    bird.toward(cursor);
});