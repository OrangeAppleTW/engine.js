var bird = createSprite({
    costumes: "./assets/bird.png",
    x: 10,
    y: 10
});

bird.when('click', function () {
    this.scale = 3;
});