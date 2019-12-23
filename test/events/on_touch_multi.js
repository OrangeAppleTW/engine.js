var player = Game.createSprite('assets/bird.png');
var foods = [];

for(var i=0; i<100; i++) {
    var bird = Game.createSprite('assets/bird.png');
    bird.x = Math.random()*1200;
    bird.y = Math.random()*900;
    foods.push(bird);
}

Game.forever(function() {
    player.moveTo(Game.cursor);
});

Game.when('touch', player, foods, function(target) {
    target.x = Math.random()*1200;
    target.y = Math.random()*900;
});
