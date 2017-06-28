var bird_1 = createSprite({
    costumes: "./assets/bird.png",
    x: 100,
    y: 100,
    rotationStyle: 'full'
});

var bird_2 = createSprite({
    costumes: "./assets/bird.png",
    x: 200,
    y: 100,
    rotationStyle: 'flipped'
});

var bird_3 = createSprite({
    costumes: "./assets/bird.png",
    x: 300,
    y: 100,
    rotationStyle: 'fixed'
});

forever(function() {
    bird_1.toward(cursor);
    bird_2.toward(cursor);
    bird_3.toward(cursor);
});