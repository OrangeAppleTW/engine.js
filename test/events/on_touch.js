var player = Game.createSprite('assets/bird.png');
var food = Game.createSprite('assets/bird.png');;

food.x = Math.random()*1200;
food.y = Math.random()*900;

Game.forever(function() {
    player.moveTo(Game.cursor);
});

Game.when('touch', player, food, function(target) {
    target.x = Math.random()*1200;
    target.y = Math.random()*900;
});
