var bird_1 = Game.createSprite("./assets/bird.png");

var bird_2 = Game.createSprite({
    costumes: "./assets/bird_2.png",
    x: 30,
    y: 30
});

Game.forever(function(){
    bird_2.moveTo(Game.cursor);
    if(bird_1.touched(bird_2)) {
        bird_1.destroy();
        bird_2.destroy();
    }
});