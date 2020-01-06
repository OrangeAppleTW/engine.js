var a = Game.createSprite('./assets/bird_1.png', './assets/bird_2.png', './assets/bird_3.png');
forever(a.nextCostume.bind(a));

on('click', () => {
    stop();
    setTimeout(start, 1000);   
});
