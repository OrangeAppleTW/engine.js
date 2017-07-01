var food = [];

for(var i=0; i<30; i++) {
    var bird = Game.createSprite({
        costumes: "./assets/bird.png",
        x: Math.random()*520,
        y: Math.random()*390    
    });
    food.push(bird);
}

Game.forever(function() {
    player.moveTo(Game.cursor);
});

Game.when("click", food, function() {
    this.destroy();
});