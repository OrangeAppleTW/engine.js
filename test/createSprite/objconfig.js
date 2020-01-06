var b = Game.createSprite({
    costumes: ['./assets/bird_1.png', './assets/bird_2.png', './assets/bird_3.png'],
    x: 100,
    y: 100,
    direction: 45,
    scale: 2,
});
forever(b.nextCostume.bind(b));
