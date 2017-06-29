var bird_1 = createSprite({
    costumes: "./assets/bird.png",
    x: 100,
    y: 200,
    rotationStyle: 'full'
});

var bird_2 = createSprite({
    costumes: "./assets/bird.png",
    x: 250,
    y: 200,
    rotationStyle: 'flipped'
});

var bird_3 = createSprite({
    costumes: "./assets/bird.png",
    x: 400,
    y: 200,
    rotationStyle: 'fixed'
});

forever(function() {
    bird_1.toward(cursor);
    bird_2.toward(cursor);
    bird_3.toward(cursor);

    Game.print('full 一般旋轉(預設)', 50, 230, 'red', 16);
    Game.print('flipped 左右翻轉', 200, 230, 'red', 16);
    Game.print('fixed 固定', 350, 230, 'red', 16);
});