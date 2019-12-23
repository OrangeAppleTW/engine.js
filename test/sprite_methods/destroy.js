var bird_1 = createSprite("./assets/bird.png");

var bird_2 = createSprite({
    costumes: "./assets/bird_2.png",
    x: 30,
    y: 30
});

forever(function(){
    bird_2.moveTo(cursor);
    if(bird_1.touched(bird_2)) {
        bird_1.destroy();
        bird_2.destroy();
    }
});