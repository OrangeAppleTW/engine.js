var bird_1 = Game.createSprite("./assets/bird.png");
var bird_2 = Game.createSprite("./assets/bird_1.png");

bird.forever(function(){
    this.moveTo(Gane.cursor);
});

bird_1.when('touch', bird_2, function () {
    bird_2.moveTo(Math.random()*500, Math.random()*390);
});