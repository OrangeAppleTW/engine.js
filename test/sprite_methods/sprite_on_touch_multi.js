var player = Game.createSprite('assets/bird.png');
var food = [];

for(var i=0; i<100; i++) {
    var bird = Game.createSprite('assets/bird.png');
    bird.x = Math.random()*1200;
    bird.y = Math.random()*900;
    food.push(bird);
}

Game.forever(function() {
    player.moveTo(Game.cursor);
});

player.when('touch', food, function(target) {
    this.scale += 0.1;
    target.destroy();
});
