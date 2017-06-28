var bird_1 = createSprite({
    costumes: "./assets/bird.png",
    x: 100,
    y: 100
});

var bird_2 = createSprite({
    costumes: "./assets/bird.png",
    x: 200,
    y: 200
});

forever(function(){
    bird_1.moveTo(cursor);
    if(bird_1.touched(bird_2)) {
        bird_1.destroy();
        bird_2.destroy();
    }
});